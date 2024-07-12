import { appURL } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const evmActionMetadata: EVMAction = {
    title: "Sample EVM Action",
    description: "This is a sample EVM Action",
    image: "https://placehold.co/955x500",
    links: [
      {
        targetUrl: `${appURL()}/api/tx`,
        postUrl: `${appURL()}/tx-success`,
        label: "Tx",
        type: ActionLinkType.TX,
      },
      {
        targetUrl: `${appURL()}/api/signature`,
        postUrl: appURL(),
        label: "Signature",
        type: ActionLinkType.SIGNATURE,
      },
      {
        targetUrl: `https://builders.garden`,
        label: "Link",
        type: ActionLinkType.LINK,
      },
    ],
    label: "Sample Button",
  };
  return NextResponse.json(evmActionMetadata);
};
