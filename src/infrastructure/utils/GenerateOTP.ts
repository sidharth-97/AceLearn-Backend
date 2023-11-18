class GenerateOTP {
  async generateOtp(length: number): Promise<string> {
    const numericCharacters = "0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * numericCharacters.length);
      code += numericCharacters.charAt(randomIndex);
    }

    return code;
  }
}

export default GenerateOTP;
