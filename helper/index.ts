import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { decodeMetadata } from './metaplex/metadata'
import jwt from 'jsonwebtoken';
import axios from 'axios';

const METADATA_PROGRAM_PK = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const conn = new Connection(clusterApiUrl("mainnet-beta"));

export const getMintData = async () => {
  console.log("getMintData: start running.....");
  // LOGIN THE ROUTE

  console.log(4444444)

  // Get all mint addresses that creator created.
  const response = await conn.getProgramAccounts(METADATA_PROGRAM_PK, {
    filters: [
      {
        memcmp: {
          offset: 360,
          bytes: "bXB92hrdhaj6V3BP6bRq5b6qDzK5ALvsecGgUEWi4vK",
        },
      },
    ],
  });
  console.log(555555555555)
  //console.log('getProgramAccounts response', response);

  // Decode and get mint addresses from above
  const mintAddrArr = [];
  const arweaveArr = [];
  for (const elem of response) {
    const tokenMetadata = decodeMetadata(elem.account.data);
    //console.log('tokenMetadata',tokenMetadata);
    mintAddrArr.push(tokenMetadata.mint);
    arweaveArr.push({
      mint: tokenMetadata.mint,
      metaUri: tokenMetadata.data.uri,
    });
  }
  console.log(11111111111)
  // ---------- SING KEY ----------- //
  const jwtKEY: any = 'vF9Xojd5ZZbY2gUjhmDBr3Uy93Lcc5ggk3LyDLoqefY'
  var tokenKey = jwt.sign(
    {},
    jwtKEY,
    { expiresIn: "3s" });

  // Check which mint addresses from above have not yet been inserted into DB
  // call DB to get the mint address that was not yet inserted.
  console.log(222222222222)
  const missingAddresses = await axios.post(
    'http://localhost:5003/missingMintAddrAuth',
    JSON.stringify({ mintAddrArr }),
    {
      headers: {
        authorization: "bearer " + tokenKey,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(3333333333333)

  console.log("missingAddresses", missingAddresses);

  // Retrieve planetIndex and planetImage for the missing mint addresses from above
  const resultArr = [];
  for (const elem of missingAddresses.data) {
    // elem: mintAddress(string)
    const arweaveItem = arweaveArr.filter(function (data) {
      return data.mint == elem;
    })[0];

    //console.log('arweaveItem', arweaveItem);
    if (arweaveItem) {
      const { nftData } = await retrieveMetadata(arweaveItem.metaUri);

      // GET PLANET INDEX
      const nftName: any = nftData["name"];
      const planetIndex = nftName.replace("Planet #", "");

      resultArr.push({
        planetIndex,
        mintAddress: elem,
        planetImage: nftData["image"],
      });
    }
  }

  console.log("resultArr", resultArr);
  if (resultArr.length > 0) {
    //console.log('resultArr not empty. Call p1planet.');

    // Update DB with arweave data
    tokenKey = jwt.sign(
      {},
      jwtKEY,
      { expiresIn: "3s" });
    axios
      .post(
      `http://localhost:5003/p1planet`,
        JSON.stringify({ resultArr }),
        {
          headers: {
            authorization: "bearer " + tokenKey,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("p1planet: succeessfully updated", response);
        return;
      });
  } else {
    console.log("resultArr empty. Nothing was updated.");
  }

};

const retrieveMetadata = async (arweaveMetaDataURI: any) => {
  const nftInfoResponse = await axios.get(arweaveMetaDataURI);
  //console.log('nftInfoResponse',nftInfoResponse.data);
  return {
    nftData: nftInfoResponse.data,
  };
};
