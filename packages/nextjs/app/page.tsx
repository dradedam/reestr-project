"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import DiplomaStorage from "../../hardhat/artifacts/contracts/YourContract.sol/YourContract.json";

// Адрес смарт-контракта
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const RPC_URL = "http://127.0.0.1:8545"; 

type Diploma = {
  institution: string;
  degree: string;
  major: string;
  graduationYear: number;
};

export default function Home() {
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [major, setMajor] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);

  // Функция для создания экземпляра контракта
  const createContract = async () => {
    const provider = new ethers.JsonRpcProvider(RPC_URL); 
    const signer = await provider.getSigner(); 
    return new ethers.Contract(CONTRACT_ADDRESS, DiplomaStorage.abi, signer); 
  };

  // Функция для добавления диплома
  const addDiploma = async () => {
    try {
      const contract = await createContract();
      const tx = await contract.addDiploma(
        institution,
        degree,
        major,
        parseInt(graduationYear)
      );
      await tx.wait(); 
      alert("Diploma added successfully!");
      fetchDiplomas();
    } catch (err) {
      console.error("Error adding diploma:", err);
      alert("Failed to add diploma.");
    }
  };

  // Функция для получения дипломов
  const fetchDiplomas = async () => {
    try {
      const contract = await createContract(); 
      const signer = contract.runner as ethers.JsonRpcSigner; 
      const signerAddress = await signer.getAddress(); 
      const diplomas = await contract.getDiplomas(signerAddress); 
      setDiplomas(diplomas);
    } catch (err) {
      console.error("Error fetching diplomas:", err);
      alert("Failed to fetch diplomas.");
    }
  };

  
  useEffect(() => {
    fetchDiplomas();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Diploma Storage</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Institution"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Degree"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Major"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Graduation Year"
          value={graduationYear}
          onChange={(e) => setGraduationYear(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={addDiploma}>Add Diploma</button>
      </div>

      <h2>Your Diplomas</h2>
      <ul>
        {diplomas.map((diploma, index) => (
          <li key={index}>
            <strong>Institution:</strong> {diploma.institution} <br />
            <strong>Degree:</strong> {diploma.degree} <br />
            <strong>Major:</strong> {diploma.major} <br />
            <strong>Graduation Year:</strong> {diploma.graduationYear.toString()}{" "}
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
}
