import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AstroPredictionModule", (m) => {
    const astroPrediction = m.contract("AstroPrediction");
    return { astroPrediction };
});
