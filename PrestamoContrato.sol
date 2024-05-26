// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title 🌟 PrestamoContrato
 * @dev Este contrato inteligente permite a los usuarios solicitar y aceptar préstamos.
 * 📝 Los usuarios pueden solicitar un préstamo especificando el monto y la tasa de interés.
 * 💼 Otros usuarios pueden aceptar o rechazar estos préstamos.
 */
contract PrestamoContrato {
    // Estructura para representar un préstamo
    struct Prestamo {
        address prestatario; // Dirección del prestatario que solicita el préstamo
        address destinatario; // Dirección del destinatario del préstamo
        address prestamista; // Dirección del prestamista que acepta el préstamo
        uint256 monto; // Monto del préstamo solicitado
        uint256 interes; // Tasa de interés del préstamo en porcentaje
        bool aceptado; // Estado de aceptación del préstamo
        bool pagado; // Estado de pago del préstamo
    }

    // Mapeo de préstamos por dirección del prestatario
    mapping(address => Prestamo) public prestamos;

    /**
     * @dev 📢 Evento que se emite cuando se solicita un préstamo.
     * @param prestatario Dirección del prestatario que solicita el préstamo.
     * @param destinatario Dirección del destinatario del préstamo.
     * @param monto Monto del préstamo solicitado.
     * @param interes Tasa de interés del préstamo en porcentaje.
     */
    event PrestamoSolicitado(address indexed prestatario, address indexed destinatario, uint256 monto, uint256 interes);

    /**
     * @dev 🎉 Evento que se emite cuando se acepta un préstamo.
     * @param prestatario Dirección del prestatario que solicita el préstamo.
     * @param prestamista Dirección del prestamista que acepta el préstamo.
     */
    event PrestamoAceptado(address indexed prestatario, address indexed prestamista);

    /**
     * @dev 💰 Evento que se emite cuando se paga un préstamo.
     * @param prestatario Dirección del prestatario que solicita el préstamo.
     * @param prestamista Dirección del prestamista que acepta el préstamo.
     * @param monto Monto pagado.
     */
    event PrestamoPagado(address indexed prestatario, address indexed prestamista, uint256 monto);

    /**
     * @dev 💸 Función para solicitar un préstamo.
     * @param _destinatario Dirección del destinatario del préstamo.
     * @param _monto Monto del préstamo solicitado.
     * @param _interes Tasa de interés del préstamo en porcentaje.
     * 🚫 Requiere que el prestatario no tenga un préstamo pendiente.
     */
    function solicitarPrestamo(address _destinatario, uint256 _monto, uint256 _interes) external {
        require(prestamos[msg.sender].monto == 0, "Ya tienes un prestamo pendiente");
        prestamos[msg.sender] = Prestamo(msg.sender, _destinatario, address(0), _monto, _interes, false, false);
        emit PrestamoSolicitado(msg.sender, _destinatario, _monto, _interes);
    }

    /**
     * @dev ✅ Función para que el destinatario acepte o rechace un préstamo.
     * 🚫 Requiere que el prestatario tenga un préstamo pendiente.
     */
    function aceptarPrestamo() external {
        Prestamo storage prestamo = prestamos[msg.sender];
        require(prestamo.monto > 0, "No tiene prestamo pendiente");
        prestamo.aceptado = true;
        prestamo.prestamista = msg.sender;
        emit PrestamoAceptado(prestamo.prestatario, msg.sender);
    }

    /**
     * @dev ✅ Función para que el destinatario acepte o rechace un préstamo.
     * 🚫 Requiere que el destinatario tenga un préstamo pendiente.
     */
    function aceptarPrestamoDestinatario(address _prestatario) external {
        Prestamo storage prestamo = prestamos[_prestatario];
        require(prestamo.destinatario == msg.sender, "No tienes permiso para aceptar este prestamo");
        require(!prestamo.aceptado, "El prestamo ya ha sido aceptado");
        prestamo.aceptado = true;
        prestamo.prestamista = msg.sender;
        emit PrestamoAceptado(_prestatario, msg.sender);
    }

    /**
     * @dev 💳 Función para pagar un préstamo.
     * 🚫 Requiere que el préstamo esté aceptado y no pagado.
     */
    function pagarPrestamo() external payable {
        Prestamo storage prestamo = prestamos[msg.sender];
        require(prestamo.aceptado, "El prestamo no ha sido aceptado");
        require(!prestamo.pagado, "El prestamo ya ha sido pagado");

        // Verificar que el monto enviado sea igual al monto del préstamo
        require(msg.value == prestamo.monto, "El monto enviado no coincide con el monto del prestamo");

        // Transferir el monto al prestamista
        payable(prestamo.prestamista).transfer(msg.value);

        // Marcar el préstamo como pagado
        prestamo.pagado = true;

        emit PrestamoPagado(msg.sender, prestamo.prestamista, msg.value);
    }

    // Función receive: Se llama cuando el contrato recibe fondos directamente.
    receive() external payable {
        // Realizar alguna acción cuando el contrato recibe fondos directamente
        // Por ejemplo, registrar el evento de recepción de fondos
        emit FondosRecibidos(msg.sender, msg.value);
    }

    // Función fallback: Se llama cuando se envía una transacción al contrato y no coincide con ninguna función definida.
    fallback() external payable {
        // Realizar alguna acción cuando se envía una transacción y no coincide con ninguna función definida
        // Por ejemplo, registrar el evento de transacción no reconocida
        emit TransaccionNoReconocida(msg.sender, msg.value);
    }

    // Evento para registrar la recepción de fondos directamente al contrato
    event FondosRecibidos(address indexed remitente, uint256 monto);

    // Evento para registrar transacciones no reconocidas enviadas al contrato
    event TransaccionNoReconocida(address indexed remitente, uint256 monto);
}