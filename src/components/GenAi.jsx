// components/Homepage.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";


const genAI = new GoogleGenerativeAI('AIzaSyCA2Sbx6KZfo67BAkAR9fbmlGqyMCybDkE');
// const genAI = new GoogleGenerativeAI(import.meta.env.GEN_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });



export default function Header() {
  const [search, setSearch] = useState('');
  const handleChangeSearch = (e) => {
      setSearch(e.target.value);
  }
  const [aiResponse, setResponse] = useState('');

  // --------------------------------------------------------------- METHODS ----------------------------------------------------------------

  // Generative AI Call to fetch dishes

async function aiRun() {
  const prompt = `random meals related to chicken category with images and prices`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  console.log('Geminin Response : ',text)
  setResponse(text);
}

// button event trigger to consume gemini Api

const handleClick = () => {
    console.log('Runnuing aiRun...')
  aiRun();
}
return (
    <div>
      <div style={{ display: 'flex' }}>
        <input placeholder='Search Food with Category using Generative AI' onChange={(e) => handleChangeSearch(e)} />
        <button style={{ marginLeft: '20px' }} onClick={() => handleClick()}>Search</button>
      </div>
      {/* <p>{aiResponse}</p> */}
    </div>
);
}
