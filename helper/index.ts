import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { decodeMetadata } from './metaplex/metadata'
import axios from 'axios';

const METADATA_PROGRAM_PK = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
const conn = new Connection(clusterApiUrl('mainnet-beta'));


const retrieveMetadata = async (accountData: any) => {
  const tokenMetadata = decodeMetadata(accountData);
  const nftInfoResponse = await axios.get(tokenMetadata.data.uri);
  //console.log('nftInfoResponse',nftInfoResponse.data);
  return {
    nftData: nftInfoResponse.data,
    tokenMetadata,
  };
}

export const getMintData = async () => {
  console.log('getMintData: start running.....')
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

  console.log('ttttttttttttttttttt',response)

  const resultArr = [];
  for (const elem of response) {
    //console.log('check elem', elem.account);
    const { nftData, tokenMetadata } = await retrieveMetadata(
      elem.account.data
    );

    // GET PLANET INDEX
    const nftName :any = nftData['name']
    const planetIndex = nftName.replace('Planet #', ''); 

    resultArr.push({planetIndex, mintAddress : tokenMetadata.mint, planetImage: nftData['image'] })
  }

  console.log('resultArr', resultArr )
  console.log('Calling p1planet', resultArr )

  await axios
    .post("https://be.solan.io/p1planet",
      JSON.stringify({resultArr}),
      {
        headers: {
          auth: "C4QNdfAj8KsVoZcUR99WYFcS4vomW7ctsDMIkKl",
          "Content-Type": "application/json",
        },
      })
    .then((response) => {
      console.log('getMintData: succeessfully updated DB', response)
      return;
    });
};
