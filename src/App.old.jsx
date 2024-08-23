import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// import { Configuration, OpenAIApi } from "openai";

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Question</h1>
//       <Typography variant="h4" component="h1" gutterBottom>
//           Material UI Vite.js example
//         </Typography>      
//       <div className="card">
//         <textarea name="postContent" rows={10} cols={100}></textarea>
//         {/* <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p> */}
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import * as React from 'react';
import { css } from '@emotion/react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import TextField from '@mui/material/TextField';

export default function App() {
  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>
        <Typography variant="h4" component="h1" gutterBottom>Question</Typography>
        <TextareaAutosize
          minRows="10"
          autoFocus
          // inputRef={input => input && input.focus()}
          style={{ width: '100%', resize: 'vertical', overflow: 'auto', 
          // fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5, padding: '12px'
        }}
        />
        {/* <TextField
          // css={css`
          //   margin-bottom: 8px;
          //   & .MuiOutlinedInput-root:hover {
          //     & > fieldset {
          //       border-color: gold;
          //     },
          //   },
          // `}
          css={{
            marginBottom: "8px",
            "& .MuiOutlinedInput-root:hover": {
              "& > fieldset": {
                borderColor: "gold",
              },
            },
          }}
          id="outlined-sx"
          label="outlined tfield"
          variant="outlined"
        />
        <TextareaAutosize
          minRows={10}
          css={{
            marginBottom: "8px",
            "& .MuiOutlinedInput-root:hover": {
              "& > fieldset": {
                borderColor: "gold",
              },
            },
          }}

        //   css={css`
        //   width: 500px;
        //   font-family: IBM Plex Sans, sans-serif;
        //   font-size: 0.875rem;
        //   font-weight: 400;
        //   line-height: 1.5;
        //   padding: 12px;
        //   border-radius: 12px 12px 0 12px;
        // `}
        /> */}
      </Box>
    </Container>
  );
}