import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ScholarTokenModule", (m) => {
  const scholarToken = m.contract("ScholarToken");
  return { scholarToken };
});
