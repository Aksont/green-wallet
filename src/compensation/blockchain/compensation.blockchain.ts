import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY!, provider);

// !!! abi has to be updated in case of changes on contract and functions
// !!! make sure that this is correctly written, otherwise you get 'missing revert data' error
// when in fact it just did not find the function with the same singature
// eg. I had uint256 and signature used uint16 so it could not do even that mapping
const abi = [
  'function issueProof(address to, string tripId, uint16 co2, uint16 distance, uint16 trees, uint16 volunteerHours)',
  'function trainsferOwnershipThroughClaim(uint256 tokenId, address user)',
  'function tripIdToTokenId(string tripId) public view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function owner() view returns (address)', // ✅ Add this
];

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS!,
  abi,
  wallet,
);

export async function issueProofToChain(
  tripId: string,
  co2: number,
  distance: number,
  trees: number,
  volunteerHours: number,
) {
  console.log('entered bc');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const tx = await contract.issueProof(
    wallet.address,
    tripId,
    Math.floor(co2),
    Math.floor(distance),
    trees,
    volunteerHours,
  );
  console.log('await bc 1');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  await tx.wait(); // wait for transaction confirmation
  console.log('await bc 2 ');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  console.log(tx.hash);
  //   return tx.hash;
}

export async function claimProofToUser(tripId: string, userAddress: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
  const tokenId = BigInt(await contract.tripIdToTokenId(tripId));
  console.log(`Token ID for trip[${tripId}]: ${tokenId}`);
  console.log('Token ID:', tokenId.toString());
  console.log('Backend wallet (sender):', wallet.address);
  console.log('Contract owner:', await contract.owner());
  console.log('Current owner of token:', await contract.ownerOf(tokenId));

  console.log('Claiming proof on chain...');

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const tx = await contract.trainsferOwnershipThroughClaim(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      tokenId,
      userAddress,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log('Transaction sent:', tx.hash);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await tx.wait(); // Wait for confirmation
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log('Transaction confirmed:', tx.hash);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return tx.hash;
  } catch (error) {
    console.error('Blockchain claim error:', error);
    throw error;
  }
}

export async function getTokenId(tripId: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
  const tokenId = BigInt(await contract.tripIdToTokenId(tripId));

  return Number(tokenId);
}
