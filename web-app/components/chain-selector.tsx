declare var window: any;
import React, { useEffect, useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { getNetwork } from '@wagmi/core';
import { blockchains } from '@/utils/constants';
import { switchNetwork } from '@wagmi/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function ChainSelector() {
  const { isConnected } = useAccount();

  interface MyObject {
    name: string;
    logo: any;
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentChain, setCurrentChain] = useState<MyObject>({
    name: '',
    logo: '',
  });

  useEffect(() => {
    let chainId = getNetwork().chain?.id || 1;
    setChain(chainId);
  }, [isConnected]);

  const setChain = (chainId: any) => {
    const tempBlockchain = blockchains.filter((blockchain) => {
      return blockchain.id == chainId;
    });
    setCurrentChain({
      name: tempBlockchain[0].name,
      logo: tempBlockchain[0].logo,
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const changeChain = async (chainId: any) => {
    try {
      const network = await switchNetwork({ chainId });
      setChain(network.id);
    } catch (error) {
      notify(chainId);
      console.log('chain not found', error);
    }
  };
  const notify = (chainId: any) => {
    const tempBlockchain = blockchains.filter((blockchain) => {
      return blockchain.id == chainId;
    });
    console.log(tempBlockchain);

    toast.error(
      `${tempBlockchain[0].name} is not configured in your wallet, please add it to your metamask or any wallet you are using.`,
      {
        position: toast.POSITION.BOTTOM_LEFT,
      },
    );
  };
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    window.addEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);
  }, [dropdownOpen]);
  return (
    <>
      {isConnected && (
        <div className="relative inline-block">
          <div
            ref={dropdownRef}
            className="inline-flex ml-3 w-40 items-center cursor-pointer rounded-md btn-sm text-gray-700 font-medium bg-white hover:bg-gray-50 border-gray-300 shadow-none gap-3"
            onClick={toggleDropdown}
          >
            <Image
              src={currentChain.logo}
              alt={`${currentChain.name} Logo`}
              className="w-5 h-5"
            />
            <span>{currentChain.name}</span>
          </div>
          <div className={` ${dropdownOpen ? 'h-64' : ''} max-2xl md:h-auto`}>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-full bg-white rounded-md shadow-lg shadow-gray-200 py-1">
                {blockchains.map((blockchain) => {
                  return (
                    <>
                      <button
                        onClick={async () => {
                          await changeChain(blockchain.id);
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex gap-3 "
                      >
                        <Image
                          src={blockchain.logo}
                          alt={`${blockchain.name} Logo`}
                          className="w-6 h-6 text-center"
                        />
                        {blockchain.name}
                        <ToastContainer />
                      </button>
                    </>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ChainSelector;
