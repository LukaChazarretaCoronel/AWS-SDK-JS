// Importar las dependencias
const { createDBInstance, deleteDBInstance } = require('../src/services/rdsService');
const { RDSClient, CreateDBInstanceCommand, DeleteDBInstanceCommand } = require('@aws-sdk/client-rds');

// Mock del cliente de RDS
jest.mock('@aws-sdk/client-rds');

describe('rdsService', () => {

  let mockRDSClient;

  beforeEach(() => {
    // Resetear los mocks antes de cada test
    mockRDSClient = RDSClient.mockImplementation(() => ({
      send: jest.fn()
    }));
  });

  it('Debería crear una instancia de base de datos', async () => {
    // Mock de la respuesta del cliente RDS
    mockRDSClient().send.mockResolvedValueOnce({
      DBInstance: { DBInstanceIdentifier: 'db-1234', DBInstanceStatus: 'creating' }
    });

    const response = await createDBInstance('db-1234', 'mydb', 'db.t2.micro');

    // Verificar el comportamiento
    expect(response.DBInstance.DBInstanceIdentifier).toBe('db-1234');
    expect(mockRDSClient().send).toHaveBeenCalledWith(expect.any(CreateDBInstanceCommand));
  });

  it('Debería eliminar una instancia de base de datos', async () => {
    // Mock de la respuesta de eliminación de RDS
    mockRDSClient().send.mockResolvedValueOnce({
      DBInstance: { DBInstanceIdentifier: 'db-1234', DBInstanceStatus: 'deleting' }
    });

    const response = await deleteDBInstance('db-1234');

    // Verificar el comportamiento
    expect(response.DBInstance.DBInstanceIdentifier).toBe('db-1234');
    expect(mockRDSClient().send).toHaveBeenCalledWith(expect.any(DeleteDBInstanceCommand));
  });

  it('Debería manejar un error al eliminar una instancia de base de datos', async () => {
    // Mock de un error en la eliminación
    mockRDSClient().send.mockRejectedValueOnce(new Error("RDS Error"));

    await expect(deleteDBInstance('db-1234')).rejects.toThrow("RDS Error");

    // Verificar que el comando fue llamado aunque haya fallado
    expect(mockRDSClient().send).toHaveBeenCalledWith(expect.any(DeleteDBInstanceCommand));
  });

});
