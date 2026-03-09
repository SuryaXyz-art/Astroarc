import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AstroMarketModule", (m) => {
    const astroMarket = m.contract("AstroMarket");
    return { astroMarket };
});
