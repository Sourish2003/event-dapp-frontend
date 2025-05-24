import { Web3Modal } from '@web3modal/react-native';
import { WagmiConfig } from 'wagmi';
import { Web3Provider as CustomWeb3Provider } from '../contexts/Web3Context';
import { wagmiConfig, web3Modal } from '../services/ethereum/mobileWallet';

export const Web3Provider = ({ children }) => {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <CustomWeb3Provider>{children}</CustomWeb3Provider>
      </WagmiConfig>
      <Web3Modal projectId={web3Modal.options.projectId} />
    </>
  );
}; 