import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

const ONE_MILLION = 1_000_000n * 10n ** 18n;
const FIVE_HUNDRED = 500n * 10n ** 18n;
const ONE_HUNDRED = 100n * 10n ** 18n;

describe("ScholarToken", async function () {
  const { viem } = await network.create();
  const [owner, alice, bob] = await viem.getWalletClients();

  it("deploys with ScholarToken name, SCT symbol, 18 decimals, and initial supply to deployer", async function () {
    const token = await viem.deployContract("ScholarToken");

    assert.equal(await token.read.name(), "ScholarToken");
    assert.equal(await token.read.symbol(), "SCT");
    assert.equal(await token.read.decimals(), 18);
    assert.equal(await token.read.totalSupply(), ONE_MILLION);
    assert.equal(await token.read.balanceOf([owner.account.address]), ONE_MILLION);
  });

  it("allows the owner to mint new tokens", async function () {
    const token = await viem.deployContract("ScholarToken");

    await token.write.mint([alice.account.address, FIVE_HUNDRED], {
      account: owner.account,
    });

    assert.equal(await token.read.balanceOf([alice.account.address]), FIVE_HUNDRED);
    assert.equal(await token.read.totalSupply(), ONE_MILLION + FIVE_HUNDRED);
  });

  it("reverts when a non-owner tries to mint", async function () {
    const token = await viem.deployContract("ScholarToken");

    await viem.assertions.revertWithCustomError(
      token.write.mint([bob.account.address, 1n], {
        account: alice.account,
      }),
      token,
      "OwnableUnauthorizedAccount",
    );
  });

  it("supports transfer, balanceOf, approve, allowance, and transferFrom", async function () {
    const token = await viem.deployContract("ScholarToken");

    await token.write.transfer([alice.account.address, ONE_HUNDRED], {
      account: owner.account,
    });

    assert.equal(await token.read.balanceOf([alice.account.address]), ONE_HUNDRED);

    await token.write.approve([bob.account.address, ONE_HUNDRED], {
      account: alice.account,
    });

    assert.equal(
      await token.read.allowance([alice.account.address, bob.account.address]),
      ONE_HUNDRED,
    );

    await token.write.transferFrom(
      [alice.account.address, bob.account.address, ONE_HUNDRED],
      { account: bob.account },
    );

    assert.equal(await token.read.balanceOf([bob.account.address]), ONE_HUNDRED);
    assert.equal(await token.read.balanceOf([alice.account.address]), 0n);
    assert.equal(
      await token.read.allowance([alice.account.address, bob.account.address]),
      0n,
    );
  });
});
