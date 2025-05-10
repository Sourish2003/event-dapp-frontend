import { SUI_PACKAGE_ID, SUI_RPC_URL } from '@env';
import { JsonRpcProvider } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { RawSigner } from '@mysten/sui.js/signers';

// Initialize Sui provider
export const getSuiProvider = () => {
  return new JsonRpcProvider(SUI_RPC_URL);
};

// Create or get a signer
export const getSuiSigner = async (provider, keypair = null) => {
  if (!keypair) {
    keypair = Ed25519Keypair.generate();
  }
  return new RawSigner(keypair, provider);
};

// Get objects owned by an address
export const getOwnedObjects = async (provider, address) => {
  try {
    const objects = await provider.getObjectsOwnedByAddress(address);
    return objects;
  } catch (error) {
    console.error('Error getting owned objects:', error);
    throw error;
  }
};

// Example function to interact with a Move module
export const callMoveFunction = async (signer, moduleObjectId, functionName, typeArguments, arguments_) => {
  try {
    const moveCallTxn = await signer.executeMoveCall({
      packageObjectId: SUI_PACKAGE_ID,
      module: moduleObjectId,
      function: functionName,
      typeArguments,
      arguments: arguments_,
      gasBudget: 10000,
    });
    
    return moveCallTxn;
  } catch (error) {
    console.error('Error calling Move function:', error);
    throw error;
  }
};