// import { ethers } from "ethers";
//
// const KEY_STORAGE_NAME = "voter_burner_wallet";
//
// export const getOrGenerateWallet = (): ethers.Wallet => {
//     // 1. Check if we already have a key for this session
//     const existingKey = sessionStorage.getItem(KEY_STORAGE_NAME);
//
//     if (existingKey) {
//         return new ethers.Wallet(existingKey);
//     }
//
//     // 2. If not, generate a NEW random wallet
//     const newWallet = ethers.Wallet.createRandom();
//
//     // 3. Save only the PRIVATE KEY to Session Storage
//     sessionStorage.setItem(KEY_STORAGE_NAME, newWallet.privateKey);
//
//     return newWallet;
// };
//
// export const clearWallet = () => {
//     sessionStorage.removeItem(KEY_STORAGE_NAME);
// };