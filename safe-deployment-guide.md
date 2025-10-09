# Guía de Despliegue de Gnosis Safe

## Opción 1: Safe Web Interface (Recomendada)

### Pasos:
1. **Ir a**: https://app.safe.global/
2. **Conectar MetaMask** (Sepolia Testnet)
3. **Create new Safe**
4. **Configurar**:
   - Owners: Agregar al menos 2 direcciones
   - Threshold: 2 de 2 (o tu preferencia)
5. **Deploy** y confirmar transacción
6. **Copiar dirección del Safe**

## Opción 2: Safe CLI

### Instalación:
```bash
npm install -g @safe-global/safe-cli
```

### Crear Safe:
```bash
safe-cli create-safe --owners 0xOwner1,0xOwner2 --threshold 2 --network sepolia
```

## Opción 3: Smart Contract Factory

### Usar Safe Factory Contract en Sepolia:
**Factory Address**: `0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2`

### Llamar createProxyWithNonce:
- owners: [address1, address2]
- threshold: 2
- to: 0x0000000000000000000000000000000000000000
- data: 0x
- fallbackHandler: 0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4
- paymentToken: 0x0000000000000000000000000000000000000000
- payment: 0
- paymentReceiver: 0x0000000000000000000000000000000000000000

## Verificación

Después de crear el Safe:
1. **Verificar en Etherscan Sepolia**
2. **Probar transacciones de prueba**
3. **Documentar la dirección en tu README**

## Comparación: Custom vs Gnosis Safe

| Aspecto | Tu MultiSig Custom | Gnosis Safe |
|---------|-------------------|-------------|
| **Desarrollo** | ✅ Desde cero | ⚠️ Factory deployment |
| **Complejidad** | ✅ Más avanzado | ⚠️ Uso de herramienta |
| **Seguridad** | ✅ Auditado por ti | ✅ Auditado por expertos |
| **Estándar** | ⚠️ Personal | ✅ Industria estándar |
| **Funciones** | ✅ Básicas completas | ✅ Avanzadas (módulos, etc) |

## Recomendación Final

**Mantener ambos**:
1. **Tu MultiSig** - Demuestra habilidades de desarrollo
2. **Gnosis Safe** - Cumple requisito específico del TP

Esto muestra tanto habilidades técnicas como capacidad de usar herramientas estándar de la industria.