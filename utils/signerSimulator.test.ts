import { expect } from "chai";
import { ethers } from "hardhat";

describe("SignerRegistry", function () {
  let registry: any;
  let owner: any;
  let signer1: any;
  let signer2: any;

  beforeEach(async () => {
    [owner, signer1, signer2] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("SignerRegistry");
    registry = await Registry.deploy();
    await registry.deployed();
  });

  it("should add and verify trusted signers", async () => {
    await registry.addSigner(signer1.address);
    expect(await registry.isSigner(signer1.address)).to.be.true;
  });

  it("should remove a signer", async () => {
    await registry.addSigner(signer1.address);
    await registry.removeSigner(signer1.address);
    expect(await registry.isSigner(signer1.address)).to.be.false;
  });

  it("should return all trusted signers", async () => {
    await registry.addSigner(signer1.address);
    await registry.addSigner(signer2.address);
    const signers = await registry.getSigners();
    expect(signers).to.include.members([signer1.address, signer2.address]);
  });
});
