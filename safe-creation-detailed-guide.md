# Guía Detallada: Crear Gnosis Safe

## Problemas Comunes y Soluciones

### Problema 1: "Solo aparece una dirección para agregar como owner"

**Causa**: Safe detecta automáticamente tu wallet conectado
**Solución**: Necesitas agregar manualmente las direcciones adicionales

### Problema 2: "Demora mucho"

**Causas posibles**:
- Red congestionada
- Gas price bajo
- Problemas de conectividad
- Sepolia testnet lento

## Proceso Paso a Paso

### Paso 1: Preparación Previa
1. **Abrir MetaMask**
2. **Verificar red**: Debe estar en "Sepolia Test Network"
3. **Verificar saldo**: Necesitas ETH en Sepolia para gas
4. **Tener listas las direcciones**: Copia ambas direcciones de owner

### Paso 2: Acceder a Safe
1. **Ir a**: https://app.safe.global/welcome
2. **Click "Create new Safe"** o "Get Started"
3. **Conectar wallet**: Click "Connect Wallet" → MetaMask

### Paso 3: Configurar Red
1. **Verificar red en la esquina superior derecha**
2. **Si no es Sepolia**: Click el dropdown y seleccionar "Sepolia"
3. **Esperar sincronización**

### Paso 4: Configurar Owners (IMPORTANTE)

#### Tu wallet aparecerá automáticamente como Owner 1:
- **Owner 1**: `0x4829f4f3aadee47Cb1cc795B2eC78A166042e918` (tu wallet actual)

#### Agregar Owner 2 manualmente:
1. **Click "+ Add another owner"** o el botón "+"
2. **Pegar segunda dirección**: `0xbEdeE081acb0c97341DBB6005050307667957F60`
3. **Opcional**: Asignar nombre "Owner 2"

### Paso 5: Configurar Threshold
1. **Threshold dropdown**: Seleccionar "2 out of 2"
2. **Esto significa**: Ambos owners deben firmar cada transacción

### Paso 6: Naming y Review
1. **Safe name**: Ej: "Eduardo MultiSig Wallet"
2. **Review settings**:
   - Owners: 2 addresses
   - Threshold: 2/2
   - Network: Sepolia

### Paso 7: Deploy (Aquí puede demorar)
1. **Click "Create"**
2. **MetaMask popup**: Confirmar transacción
3. **Gas fee**: Acepta (debería ser bajo en testnet)
4. **Esperar**: 30 segundos - 5 minutos dependiendo de la red

### Paso 8: Verificación
1. **Safe Address**: Aparecerá cuando se complete
2. **Copy address**: Guardar para tu README
3. **View on Etherscan**: Verificar el contrato

## Solución a Problemas Específicos

### Si solo aparece 1 dirección:
```
Método 1: Manual Add
- Buscar botón "+ Add another owner"
- Pegar segunda dirección completa
- Verificar que sean diferentes

Método 2: Disconnect/Reconnect
- Disconnect MetaMask
- Cambiar a segunda cuenta en MetaMask
- Reconectar
- Agregar primera cuenta manualmente
```

### Si demora mucho:
```
Verificar:
1. Network congestion en Sepolia
2. Gas price en MetaMask (usar "Fast")
3. ETH balance suficiente
4. Browser cache (refresh página)

Alternativas:
1. Esperar 10-15 minutos
2. Cancelar y reintentar con gas más alto
3. Probar en horario diferente
```

### Si falla el deployment:
```
Posibles causas:
- Insufficient gas
- Network timeout
- Invalid owner addresses

Soluciones:
- Increase gas limit
- Verificar addresses son válidas
- Reintentar en momento diferente
```

## Información Técnica

### Gas Costs Típicos (Sepolia):
- Safe Creation: ~200,000 - 400,000 gas
- Costo aprox: 0.001 - 0.002 ETH en testnet

### Tiempos Esperados:
- UI Load: 10-30 segundos
- Transaction confirmation: 15 segundos - 2 minutos
- Safe indexing: 1-3 minutos adicionales

## Verificación Final

Una vez creado:
1. **Copy Safe Address**
2. **Verificar en Etherscan Sepolia**: https://sepolia.etherscan.io/address/[SAFE_ADDRESS]
3. **Test basic functions** en Safe UI
4. **Update README** con la nueva dirección

## Contactos de Respaldo

Si tienes problemas persistentes:
- Safe Documentation: https://docs.safe.global/
- Safe Discord: Para support técnico
- Etherscan Sepolia: Para verificar transacciones

## Direcciones a Usar

**Owner 1**: 0x4829f4f3aadee47Cb1cc795B2eC78A166042e918
**Owner 2**: 0xbEdeE081acb0c97341DBB6005050307667957F60
**Threshold**: 2 of 2
**Network**: Sepolia Testnet