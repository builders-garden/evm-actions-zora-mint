import { appURL } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const evmActionMetadata: EVMAction = {
    title: "Mint Zora NFTs EVM Action",
    description: "This is a sample EVM Action for minting ERC1155 Zora tokens",
    image: "https://placehold.co/955x500",
    links: [
      {
        targetUrl: `${appURL()}/api/tx?collectionAddress=${searchParams.get('collectionAddress')}&tokenId=${searchParams.get('tokenId')}&amount=${searchParams.get('amount')}`,
        postUrl: `${appURL()}/tx-success`, // this will be a GET HTTP call
        label: "Tx",
        type: ActionLinkType.TX,
      },
    ],
    label: "Mint NFT",
  };
  return NextResponse.json(evmActionMetadata);
};