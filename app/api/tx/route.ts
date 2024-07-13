import { erc20Abi } from "@/lib/contracts/erc20abi";
import { base, baseSepolia } from "viem/chains";
import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData, http, parseUnits } from "viem";
import { createPublicClient } from 'viem'
import { FIXED_PRICE_SALE_STRATEGY, MERKLE_MINT_SALE_STRATEGY, NATIVE_TOKEN } from "@/lib/constants";
import { ERC1155_CONTRACT_ABI, ZORA_FIXED_PRICE_STRATEGY_ABI, ZORA_MERKLE_MINT_STRATEGY_ABI } from "@/lib/abis";
import { utils } from "ethers";



export const POST = async (req: NextRequest) => {
  //https://zora.co/collect/base:0xa0487df3ab7a9e7ba2fd6bb9acda217d0930217b/48
  const body = await req.json();
  const { address } = body;
  const { searchParams } = new URL(req.url);
  const collectionAddress = searchParams.get('collectionAddress');
  const tokenId = searchParams.get('tokenId');
  const amount = searchParams.get('amount');

  const { params} = await mint1155(
    collectionAddress!,
    tokenId!,
    address,
    amount!
  );
  if (!params) {
    throw new Error("Invalid mint parameters");
  }

  return NextResponse.json({
    transactions: [
      {
      chainId: base.id, // Base Mainnet 8453
      to: params.to,
      data: params.data,
      value: params.value,
      },
    ]
  });
};
// function to mint ERC1155 Zora tokens
export async function mint1155(
  collectionAddress: string,
  tokenId: string,
  fromAddress: string,
  amount?: string
): Promise<{ params: any }> {
  if (!collectionAddress || !tokenId || !fromAddress) {
    throw new Error("Invalid mint parameters");
  }
  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  let merkleMintStrategy;
  let valueAmount: bigint;
  const fixedPriceStrategy = await publicClient.readContract({
    address: FIXED_PRICE_SALE_STRATEGY,
    abi: ZORA_FIXED_PRICE_STRATEGY_ABI,
    functionName: "sale",
    args: [collectionAddress as `0x${string}`, BigInt(tokenId)],
  });
  const isFixedPriceStrategy = fixedPriceStrategy.pricePerToken !== BigInt(0);

  if (!isFixedPriceStrategy) {
    merkleMintStrategy = await publicClient.readContract({
      address: MERKLE_MINT_SALE_STRATEGY,
      abi: ZORA_MERKLE_MINT_STRATEGY_ABI,
      functionName: "sale",
      args: [collectionAddress as `0x${string}`, BigInt(tokenId)],
    });
  }
  const isMerkleMintStrategy = merkleMintStrategy?.merkleRoot !== NATIVE_TOKEN;

  if (!isFixedPriceStrategy && !isMerkleMintStrategy) {
    throw new Error("Zora Collection is not following a supported mint strategy");
  }

  const mintAmount = amount ? BigInt(amount) : BigInt("1");

  if (isFixedPriceStrategy) {
    const fee = await publicClient.readContract({
      address: collectionAddress as `0x${string}`,
      abi: ERC1155_CONTRACT_ABI,
      functionName: "mintFee",
    });
    const tokenPrice = fixedPriceStrategy.pricePerToken;
    valueAmount = (fee + tokenPrice) * mintAmount;

    const minterArgs = utils.defaultAbiCoder.encode(["address"], [fromAddress as `0x${string}`]) as string;

    const mintData = encodeFunctionData({
      abi: ERC1155_CONTRACT_ABI,
      functionName: "mintWithRewards",
      args: [
        FIXED_PRICE_SALE_STRATEGY,
        BigInt(tokenId),
        mintAmount,
        minterArgs as `0x${string}`,
        process.env.ZORA_REFERRAL_ADDRESS ? (process.env.ZORA_REFERRAL_ADDRESS as `0x${string}`) : NATIVE_TOKEN,
      ],
    });

    return {
      params: {
        abi: ERC1155_CONTRACT_ABI,
        to: collectionAddress as `0x${string}`,
        data: mintData,
        value: valueAmount.toString(),
      },
    };
  }

  // If implementing Merkle Mint Strategy, ensure to return a similar structure here
  // For now, we'll throw an error as a placeholder
  throw new Error("Merkle Mint Strategy not implemented yet");
}