import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AstroReportModule", (m) => {
    const astroReport = m.contract("AstroReport");
    return { astroReport };
});
