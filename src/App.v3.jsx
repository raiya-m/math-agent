import * as React from 'react';
import { useState, useRef, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from "axios";
import { Camera } from "react-camera-pro";
import Webcam from "react-webcam";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoHelpCircleOutline } from "react-icons/io5";
import { IoHelpCircle } from "react-icons/io5";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import * as MathLive from "mathlive";
import 'mathlive/fonts.css'
// import "//unpkg.com/mathlive"


var openai = axios.create({
	baseURL: 'https://api.openai.com/v1',
	headers: { 'Authorization': 'Bearer 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' }
});

var mathpix = axios.create({
	baseURL: 'https://api.mathpix.com/v3',
	headers: {
		'app_key': '16432382e71a5b18210b4b5036068969639312a0bcad02f2d5dfc11e48acfcb4',
		'app_id': 'raiyaminhas_f95c3c_c8db1e'
	}
});

// axios.defaults.headers.common['Authorization'] = `Bearer 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`;
const TEST_TIMEOUT = 1000

const CustomTextareaAutosize = styled(TextareaAutosize)({
	borderRadius: 10,
	// resize: "none",
	// "&:focus": {
	// 	border: `2px solid #454F5B`
	// },
	// "&:hover": {
	// 	border: `2px solid #F4F6F8`
	// }
});


export default function App() {
	const isLargeScreen = useMediaQuery('(min-width:600px)');

	const [browserWidth, setBrowserWidth] = useState(window.innerWidth)
	const [browserHeight, setBrowserHeight] = useState(window.innerHeight)
	const [useCamera, setUseCamera] = useState(true)
	const [isCameraReady, setIsCameraReady] = useState(false)
	const [question, setQuestion] = useState("7 + 2x = 12 - 3x")
	const [questionLatex, setQuestionLatex] = useState("")
	const [answer, setAnswer] = useState()
	const [similarQuestions, setSimilarQuestions] = useState()
	// const [similarQuestionIndex, setSimilarQuestionIndex] = useState()
	// const [hintIndex, setHintIndex] = useState();
	// const [similarQuestionAnswer, setSimilarQuestionAnswer] = useState('')
	// const [similarQuestionAnswerCorrect, setSimilarQuestionAnswerCorrect] = useState()
	// const [finishedSimilarQuestions, setFinishedSimilarQuestions] = useState()
	const [cameraImage, setCameraImage] = useState()
	const [solution, setSolution] = useState(null)
	const [showSolutionOptions, setShowSolutionOptions] = useState(false)
	const [showResults, setShowResults] = useState(false)
	const [showInprogress, setShowInprogress] = useState(false)

	const questionInputRef = useRef();
	const answerRef = useRef();
	const cameraRef = useRef();
	const mathFieldRef = useRef();

	// useEffect(() => {
		// if (mathFieldRef.current) {
		// 	mathFieldRef.current.mathVirtualKeyboardPolicy = "manual";
		// 	mathFieldRef.current.addEventListener("focusin", (evt) =>
		// 		window.mathVirtualKeyboard.show()
		// 	);
		// 	mathFieldRef.current.addEventListener("focusout", (evt) =>
		// 		window.mathVirtualKeyboard.hide()
		// 	);
		// }
	// }, []);


	useEffect(() => {
		questionInputRef.current?.focus();
		answerRef.current?.focus();
	});

	const Login = () => {		
		const [userid, setUserid] = useState('')
		const [password, setPassword] = useState('')

		const paperStyle = { padding: 20, height: '70vh', width: 280, margin: "20px auto" }
		const btnstyle = { margin: '8px 0' }

		const userAuth = async () => {
			const req = { user: userid, password: password }
			const res = await axios.post('https://math-tutor-api-raiyaminhas.replit.app/auth', req)
			res.data
			console.log(res);			
		}

		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="100vh"
				minWidth="100vw"
				maxHeight="100vh"
				maxWidth="100vw"
			>
				<Paper elevation={10} style={paperStyle}>
					<Grid align='center'>
						{/* <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar> */}
						<h2>Sign In</h2>
					</Grid>
					{/* <form onSubmit={() => userAuth()}> */}
						<TextField value={userid} onChange={(event) => { setUserid(event.target.value); }} label='Username' placeholder='Enter username' variant="outlined" fullWidth required />
						<TextField value={password} onChange={(event) => { setPassword(event.target.value); }} label='Password' placeholder='Enter password' type='password' variant="outlined" fullWidth required />
						{/* <FormControlLabel
					control={
						<Checkbox
							name="checkedB"
							color="primary"
						/>
					}
					label="Remember me"
				/> */}
						<Button onClick={userAuth} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Sign in</Button>
					{/* </form> */}
					{/* <Typography >
					<Link href="#" >
						Forgot password ?
					</Link>
				</Typography> */}
					{/* <Typography > Do you have an account ?
					<Link href="#" >
						Sign Up
					</Link>
				</Typography> */}
				</Paper>
			</Box>)
	}	
	return <Login />


	const solveQuestion = async () => {
		console.log('solve question: ', question);
		setShowInprogress(true)
		// const req = {
		// 	"model": "gpt-3.5-turbo",
		// 	"temperature": 0,
		// 	"messages": [
		// 		{
		// 			"role": "system",
		// 			"content": `You are a helpful assistant that solves math problems at a Grade 5 level. You respond only with JSON. You do not respond with text.  When formatting a JSON response, the question should have a JSON key called 'question' and the solution should have a JSON key called 'answer'.  The 'answer' JSON element should be an object of solution steps with key names in the format 'step1','step2','step3', etc."`
		// 		},
		// 		{
		// 			"role": "user",
		// 			"content": "I can't solve this.  Give me detailed steps for how to solve it: Solve for x: 7 + 2x = 12 - 3x"
		// 		}
		// 	]
		// }
		// const res = await axios.post('https://api.openai.com/v1/chat/completions', req)
		// const answerStr = res.data.choices[0].message.content;
		// const answerStr = '{ "question": "7 + 2x = 12 - 3x", "answer": { "step1": "Combine like terms on each side of the equation. Bring x terms to one side and constants to the other side.", "step2": "Add 3x to both sides to get rid of the -3x term on the right side of the equation.", "step3": "Subtract 7 from both sides to get rid of the 7 on the left side of the equation.", "step4": "Combine like terms on each side again.", "step5": "Divide both sides by 5 to solve for x.", "step6": "Simplify if needed."}}'
		// const answerStr = '{ "question": "Solve for x: 7 + 2x = 12 - 3x", "answer": { "step1": "Combine like terms on both sides of the equation:", "step2": "7 + 2x + 3x = 12 - 3x + 3x", "step3": "Combine like terms:", "step4": "7 + 5x = 12", "step5": "Subtract 7 from both sides of the equation:", "step6": "7 + 5x - 7 = 12 - 7", "step7": "Combine like terms:", "step8": "5x = 5", "step9": "Divide both sides of the equation by 5:", "step10": "5x / 5 = 5 / 5", "step11": "Simplify:", "step12": "x = 1" }}'
		// const a = JSON.parse(answerStr)
		const a = {
			"question": "7 + 2x = 12 - 3x",
			"answer": {
				"step1": "Add 3x to both sides to get rid of x on the right side: 7 + 2x + 3x = 12 - 3x + 3x",
				"step2": "Simplify both sides: 7 + 5x = 12",
				"step3": "Subtract 7 from both sides to isolate x: 5x = 12 - 7",
				"step4": "Simplify the right side: 5x = 5",
				"step5": "Divide both sides by 5 to solve for x: x = 5 / 5",
				"step6": "Simplify to find the value of x: x = 1"
			}
		}
		setTimeout(() => { setAnswer(a.answer); setShowInprogress(false) }, TEST_TIMEOUT)
	}

	const createSimilarQuestions = async () => {
		setShowInprogress(true)
		console.log('create similar question for: ', questionLatex);

		// const openaiReq = {
		// 	"model": "gpt-4-0613",
		// 	"temperature": 0,
		// 	"messages": [
		// 		{
		// 			"role": "system",
		// 			"content": `You are a helpful assistant that solves math problems at a Grade 5 level. You respond only with JSON. You do not respond with text.  When formatting a JSON response, the question should have a JSON key called 'question' and the solution should have a JSON key called 'answer'.  The 'answer' JSON element should be an object of solution steps with key names in the format 'step1','step2','step3', etc."`
		// 		},
		// 		{
		// 			"role": "user",
		// 			"content": "Create 3 new questions that are similar to: Solve for x: " + questionLatex
		// 		}
		// 	]
		// }
		// const openaiRes = await openai.post('/chat/completions', openaiReq)
		// const simqsStr = openaiRes.data.choices[0].message.content;
		// const openaiSimQs = JSON.parse(simqsStr)
		const openaiSimQs = {
			questions: [
				{
					"question": "Solve for x: 10 + 3x = 5",
					"answer": {
						"step1": "Subtract 10 from both sides: 3x = 5 - 10",
						"step2": "Simplify: 3x = -5",
						"step3": "Divide both sides by 3: x = -5 / 3",
						"step4": "Simplify: x = -1.67"
					}
				},
				{
					"question": "Solve for x: 6 + 4x = 2",
					"answer": {
						"step1": "Subtract 6 from both sides: 4x = 2 - 6",
						"step2": "Simplify: 4x = -4",
						"step3": "Divide both sides by 4: x = -4 / 4",
						"step4": "Simplify: x = -1"
					}
				},
				{
					"question": "Solve for x: 7 + 5x = 2",
					"answer": {
						"step1": "Subtract 7 from both sides: 5x = 2 - 7",
						"step2": "Simplify: 5x = -5",
						"step3": "Divide both sides by 5: x = -5 / 5",
						"step4": "Simplify: x = -1"
					}
				}
			]
		}
		console.log('openaiSimQs', openaiSimQs);
		setSimilarQuestions(openaiSimQs.questions)
		setShowInprogress(false)

		// const req = {
		// 	"model": "gpt-3.5-turbo",
		// 	"temperature": 0,
		// 	"messages": [
		// 		{
		// 			"role": "system",
		// 			"content": `You are a helpful assistant that solves math problems at a Grade 5 level. You respond only with JSON. You do not respond with text.  When formatting a JSON response, the question should have a JSON key called 'question' and the solution should have a JSON key called 'answer'.  The 'answer' JSON element should be an object of solution steps with key names in the format 'step1','step2','step3', etc.  Your response should be a single JSON structure."`
		// 		},
		// 		{
		// 			"role": "user",
		// 			"content": "Create 3 new questions that are similar to: Solve for x: 7 + 2x = 12 - 3x"
		// 		}
		// 	]
		// }
		// const res = await axios.post('https://api.openai.com/v1/chat/completions', req)
		// const sqStr = res.data.choices[0].message.content;
		// console.log(sqStr);

		// const sqStr = '{ "question1": { "question": "Solve for x: 5 + 3x = 10 - 2x", "answer": { "step1": "Combine like terms: 5 + 3x = 10 - 2x", "step2": "Move the variable terms to one side: 3x + 2x = 10 - 5", "step3": "Combine like terms: 5x = 5", "step4": "Divide both sides by 5: x = 1"} }, "question2": { "question": "Solve for x: 4 - 5x = 9 + 2x", "answer": { "step1": "Combine like terms: 4 - 5x = 9 + 2x", "step2": "Move the variable terms to one side: -5x - 2x = 9 - 4", "step3": "Combine like terms: -7x = 5", "step4": "Divide both sides by -7: x = -5/7" } }, "question3": { "question": "Solve for x: 2x + 3 = 5x - 1", "answer": { "step1": "Combine like terms: 2x + 3 = 5x - 1", "step2": "Move the variable terms to one side: 2x - 5x = -1 - 3", "step3": "Combine like terms: -3x = -4", "step4": "Divide both sides by -3: x = 4/3"}}}'
		// const sq = JSON.parse(sqStr)
		// setTimeout(() => { setSimilarQuestions(sq); setShowInprogress(false) }, TEST_TIMEOUT)
	}

	// const verifyAnswer = async () => {
	// 	setSimilarQuestionAnswerCorrect('correct')

	// 	if (Object.values(similarQuestions).length > (similarQuestionIndex + 1)) {
	// 	} else {
	// 		// setSimilarQuestions(null)
	// 		// setSimilarQuestionIndex(null)
	// 		setFinishedSimilarQuestions(true)
	// 	}
	// }

	// const showHint = async () => {
	// 	setHintIndex(hintIndex == null ? 0 : (hintIndex + 1))
	// }

	// const nextSimilarQuestion = async () => {
	// 	setHintIndex()
	// 	setSimilarQuestionAnswerCorrect(null)
	// 	setSimilarQuestionAnswer('')

	// 	if (Object.values(similarQuestions).length > (similarQuestionIndex + 1)) {
	// 		setSimilarQuestionIndex(similarQuestionIndex + 1)
	// 	} else {
	// 		// setSimilarQuestions(null)
	// 		// setSimilarQuestionIndex(null)
	// 		// setFinishedSimilarQuestions(true)
	// 	}
	// }

	const restart = async () => {
		setAnswer()
		setSimilarQuestions()
		// setSimilarQuestionIndex()
		// setSimilarQuestionAnswer('')
		// setFinishedSimilarQuestions()
		// setSimilarQuestionAnswerCorrect()

		resetQuestion()
	}

	const createMoreQuestions = async () => {
		setAnswer()
		setSimilarQuestions()
		// setSimilarQuestionIndex()
		// setSimilarQuestionAnswer('')
		// setFinishedSimilarQuestions()
		// setSimilarQuestionAnswerCorrect()
		createSimilarQuestions()
	}

	const takePhotoOfQuestion = async () => {
		const photo = cameraRef.current.getScreenshot()
		setCameraImage(photo)

		// show bottom panel
		setShowResults(true)

		console.log('sending to mathpix!');
		// TEST
		// const req = {
		// 	"src": "https://mathpix-ocr-examples.s3.amazonaws.com/cases_hw.jpg",
		// 	"math_inline_delimiters": ["$", "$"], "rm_spaces": true
		// }

		// const req = {
		// 	"src": photo,
		// 	"math_inline_delimiters": ["$", "$"], "rm_spaces": true
		// }
		// const res = await mathpix.post('/text', req)
		// console.log('Response from mathpix', res);
		// const question = res.data.latex_styled
		// console.log('question:', question);
		// setQuestionLatex(question)

		// TESTS
		// setTimeout(() => { setQuestionLatex("f(x)=\\left\\{\\begin{array}{ll}\nx^{2} & \\text { if } x<0 \\\\\n2 x & \\text { if } x \\geq 0\n\\end{array}\\right.") }, 1500)
		// setTimeout(() => { setQuestionLatex("7 + 2x = 12 - 3x") }, 1500)

		console.log('sending to openai/wolfram to solve')

		// WOLFRAM
		// const encodedQuery = encodeURIComponent(question).replace(/%20/g,'+')
		// const res2 = await axios.get('http://api.wolframalpha.com/v2/query?appid=8KVT48-WYKR247THJ&input=' + encodedQuery + '&output=json')
		// const pods = res2.data.queryresult.pods;
		// for (let i = 0; i < pods.length;i++) {
		// 	console.log(pods[i].subpods[0]);
		// }

		// OPENAI
		const question = '8 + 2x = 2'
		setQuestionLatex(question)
		// const openaiReq = {
		// 	"model": "gpt-4-0613",
		// 	"temperature": 0,
		// 	"messages": [
		// 		{
		// 			"role": "system",
		// 			"content": `You are a helpful assistant that solves math problems at a Grade 5 level. You respond only with JSON. You do not respond with text.  When formatting a JSON response, the question should have a JSON key called 'question' and the solution should have a JSON key called 'answer'.  The 'answer' JSON element should be an object of solution steps with key names in the format 'step1','step2','step3', etc."`
		// 		},
		// 		{
		// 			"role": "user",
		// 			"content": "I can't solve this.  Give me detailed steps for how to solve it: " + question
		// 		}
		// 	]
		// }
		// const openaiRes = await openai.post('/chat/completions', openaiReq)
		// const answerStr = openaiRes.data.choices[0].message.content;
		// const openaiAnswer = JSON.parse(answerStr)
		// console.log(openaiAnswer);
		// setSolution(openaiAnswer)

		// WORKING TEST
		const a = {
			"question": "7 + 2x = 12 - 3x",
			"answer": {
				"step1": "Add 3x to both sides to get rid of x on the right side: 7 + 2x + 3x = 12 - 3x + 3x",
				"step2": "Simplify both sides: 7 + 5x = 12",
				"step3": "Subtract 7 from both sides to isolate x: 5x = 12 - 7",
				"step4": "Simplify the right side: 5x = 5",
				"step5": "Divide both sides by 5 to solve for x: x = 5 / 5",
				"step6": "Simplify to find the value of x: x = 1"
			}
		}
		setTimeout(() => { setSolution(a) }, TEST_TIMEOUT)


		// mathFieldRef.current.executeCommand("deleteAll")
		// // mathFieldRef.current.insert("f(x)=\\left\\{\\begin{array}{ll}\nx^{2} & \\text { if } x<0 \\\\\n2 x & \\text { if } x \\geq 0\n\\end{array}\\right.")
		// mathFieldRef.current.insert(question);
		// window.mathVirtualKeyboard.hide()
	}


	const Spinner = () => {
		return (
			<Box>
				<Box paddingBottom={2}>
					<Typography textAlign={'center'} sx={{ fontSize: 20 }}>Processing</Typography>
				</Box>
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<CircularProgress value={25} />
				</Box>
			</Box>
		)
	}

	// const SolutionSteps = () => {
	// 	if (solution == null) {
	// 		return (<Box />)
	// 	}

	// 	let steps = []
	// 	Object.keys(solution.answer).map((step, index) => {
	// 		if (index < (Object.keys(solution.answer).length - 1)) {
	// 			steps.push(
	// 				<Box key={index} className="solutionStep" sx={{ borderBottom: '1px solid rgba(128,128,128,.25)' }}>
	// 					<Typography style={{ fontFamily: 'Katex', fontSize: isLargeScreen ? 20 : 20 }}>{solution.answer[step]}</Typography>
	// 				</Box>
	// 			)
	// 		} else {
	// 			// last step
	// 			steps.push(
	// 				<Box key={index} className="solutionStep" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
	// 					<Typography style={{ color: 'red', fontWeight: 'bold', fontSize: isLargeScreen ? 16 : 16, paddingBottom: 3 }}>Solution</Typography>
	// 					<Typography style={{ fontFamily: 'Katex', fontSize: isLargeScreen ? 20 : 20 }}>{solution.answer[step]}</Typography>
	// 				</Box>
	// 			)
	// 		}

	// 		// steps.push(
	// 		// 	<Box key={index} className="solutionStep" sx={index < (Object.keys(solution.answer).length - 1) ? {borderBottom: '1px solid rgba(128,128,128,.25)'} : {}}>
	// 		// 		<Typography style={{fontFamily: 'Katex', fontSize: isLargeScreen ? 20 : 20}}>{solution.answer[step]}</Typography>
	// 		// 	</Box>
	// 		// )
	// 	})
	// 	return steps
	// }
	const SolutionSteps = () => {

		const [expandedPanel, setExpandedPanel] = useState();
		const [explanation, setExplanation] = useState({});
		const [contentLoading, setContentLoading] = useState(true);

		const loadHelpForStep = async (stepIndex) => {
			if (expandedPanel === 'panel' + (stepIndex + 1)) {
				setExpandedPanel(null)
				return
			}
			setExpandedPanel('panel' + (stepIndex + 1))
			setContentLoading(true)

			// console.log('stepIndex',stepIndex, Object.values(solution.answer)[stepIndex]);
			const stepQuestion = Object.values(solution.answer)[stepIndex]
			const openaiReq = {
				"model": "gpt-4-0613",
				"temperature": 0,
				"messages": [
					{
						"role": "system",
						"content": `You are a helpful assistant that solves math problems at a Grade 5 level. You respond only with JSON. You do not respond with text.  When formatting a JSON response, the question should have a JSON key called 'question' and the solution should have a JSON key called 'answer'.  The 'answer' JSON element should be an object of solution steps with key names in the format 'step1','step2','step3', etc."`
					},
					{
						"role": "user",
						"content": `I'm solving this math question: ${solution.question}.  I'm stuck on the step "${stepQuestion}".  Please explain it to me`
					}
				]
			}
			const openaiRes = await openai.post('/chat/completions', openaiReq)
			const expStr = openaiRes.data.choices[0].message.content;
			const openaiExplanation = JSON.parse(expStr)
			console.log('openaiExplanation', openaiExplanation);
			setContentLoading(false)
			setExplanation(openaiExplanation.answer)

			// setTimeout(() => {
			// 	setContentLoading(false)
			// 	const e = {
			// 		"question": "Simplify the right side: 5x = 5",
			// 		"answer": {
			// 		  "step1": "The equation 5x = 5 means that 5 times some number x equals 5.",
			// 		  "step2": "To find the value of x, you need to isolate x on one side of the equation.",
			// 		  "step3": "To do this, you can divide both sides of the equation by 5.",
			// 		  "step4": "When you divide 5x by 5, you get x.",
			// 		  "step5": "When you divide 5 by 5, you get 1.",
			// 		  "step6": "So, the simplified equation is x = 1."
			// 		}
			// 	  }
			// 	setExplanation(e.answer)
			// }, TEST_TIMEOUT)
		}

		if (solution == null) {
			return (<Box />)
		}

		let steps = []
		Object.keys(solution.answer).map((step, index) => {
			if (index < (Object.keys(solution.answer).length - 1)) {
				steps.push(
					<Accordion
						key={index}
						sx={{
							'&:before': {
								display: 'none',
							},
							border: 'none',
							boxShadow: 'none',
							// borderBottom: '1px solid rgba(128,128,128,.1)'
						}}
						className="solutionStepAccordian"
						// sx={{ border: 'none' }}
						expanded={expandedPanel === `panel${(index + 1)}`} TransitionProps={{ unmountOnExit: true }}
					// onChange={(e) => loadHelpForStep(index)}
					>
						<AccordionSummary
							sx={{
								"& .MuiAccordionSummary-expandIconWrapper": {
									transition: "none",
									"&.Mui-expanded": {
										transform: "none",
									},
								},
							}}
							expandIcon={
								<Tooltip title="Explain this step">
									<IconButton onClick={() => loadHelpForStep(index)}>
										<IoHelpCircle color='green' />
									</IconButton>
								</Tooltip>
							}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography style={{ fontFamily: 'Katex', fontSize: isLargeScreen ? 20 : 20 }}>{solution.answer[step]}</Typography>
						</AccordionSummary>
						<AccordionDetails>
							{contentLoading ?
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
									<Box paddingBottom={2}>
										<Typography textAlign={'center'} fontSize={20}>Processing</Typography>
									</Box>
									<CircularProgress value={25} />
								</Box> :
								<Box>
									<Explanation explanationSteps={explanation} />
								</Box>
							}
						</AccordionDetails>
					</Accordion>
				)
				// steps.push(
				// 	<Box key={index} className="solutionStep" sx={{ borderBottom: '1px solid rgba(128,128,128,.25)' }}>
				// 		<Typography style={{ fontFamily: 'Katex', fontSize: isLargeScreen ? 20 : 20 }}>{solution.answer[step]}</Typography>
				// 	</Box>
				// )
			} else {
				// last step
				steps.push(
					<Box key={index} className="solutionStep" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
						<Typography style={{ color: 'red', fontWeight: 'bold', fontSize: isLargeScreen ? 16 : 16, paddingBottom: 3 }}>Solution</Typography>
						<Typography style={{ fontFamily: 'Katex', fontSize: isLargeScreen ? 20 : 20 }}>{solution.answer[step]}</Typography>
					</Box>
				)
			}

			// steps.push(
			// 	<Box key={index} className="solutionStep" sx={index < (Object.keys(solution.answer).length - 1) ? {borderBottom: '1px solid rgba(128,128,128,.25)'} : {}}>
			// 		<Typography style={{fontFamily: 'Katex', fontSize: isLargeScreen ? 20 : 20}}>{solution.answer[step]}</Typography>
			// 	</Box>
			// )
		})
		return steps
	}

	const Explanation = (props) => {
		console.log('explanationSteps', props.explanationSteps);

		const [explanationSteps, setExplanationSteps] = useState(props.explanationSteps)

		let steps = []
		Object.keys(explanationSteps).map((step, index) => {
			if (index < (Object.keys(explanationSteps).length - 1)) {
				steps.push(
					<Box key={index} className="explanationStep" sx={{ borderBottom: '1px solid rgba(128,128,128,.25)' }}>
						<Typography style={{ fontFamily: 'Katex', fontSize: isLargeScreen ? 20 : 20 }}>{explanationSteps[step]}</Typography>
					</Box>
				)
			} else {
				steps.push(
					<Box key={index} className="explanationStep" >
						<Typography style={{ fontFamily: 'Katex', fontSize: isLargeScreen ? 20 : 20 }}>{explanationSteps[step]}</Typography>
					</Box>
				)
			}
		})
		return (
			<Paper elevation={2} sx={{ margin: '1rem', padding: isLargeScreen ? '2em' : '1em', borderRadius: 5, backgroundColor: 'white' }}>
				<Typography sx={{ fontSize: 24, fontWeight: 'bold' }} textAlign={'center'}>Explanation</Typography>
				{steps}
			</Paper>)
	}

	const resetQuestion = () => {
		setSolution(null)
		setQuestionLatex(null)
		setShowResults(false)
		setCameraImage(null)
	}

	const SimilarQuestions = () => {
		const [similarQuestionAnswer, setSimilarQuestionAnswer] = useState('')
		const [similarQuestionAnswerCorrect, setSimilarQuestionAnswerCorrect] = useState()
		const [finishedSimilarQuestions, setFinishedSimilarQuestions] = useState()
		const [similarQuestionIndex, setSimilarQuestionIndex] = useState(0)
		const [hintIndex, setHintIndex] = useState();
		const [showWait, setShowWait] = useState(false)

		const verifyAnswer = async () => {
			setShowWait(true)

			const openaiReq = {
				"model": "gpt-4-0613",
				"temperature": 0,
				"messages": [
					{
						"role": "system",
						"content": `You are a helpful assistant that solves math problems at a Grade 5 level. You respond only with JSON. You do not respond with text. When formatting a JSON response, return a single JSON key called isCorrect with a true/false value.`
					},
					{
						"role": "user",
						"content": "I'm trying to solve this question: " + similarQuestions[similarQuestionIndex].question + ".  Is " + similarQuestionAnswer + " considered a correct answer?"
					}
				]
			}
			const openaiRes = await openai.post('/chat/completions', openaiReq)
			const verifyStr = openaiRes.data.choices[0].message.content;
			const openaiVerifyAnswer = JSON.parse(verifyStr)

			if (openaiVerifyAnswer.isCorrect) {
				setSimilarQuestionAnswerCorrect('correct')
				if (Object.values(similarQuestions).length > (similarQuestionIndex + 1)) {
				} else {
					setFinishedSimilarQuestions(true)
				}
			} else {
				setSimilarQuestionAnswerCorrect('incorrect')
			}

			setShowWait(false)

			// const answerSteps = Object.values(similarQuestions[similarQuestionIndex].answer)
			// const sol = answerSteps[answerSteps.length - 1]

			// if (sol.indexOf(similarQuestionAnswer) != -1) {
			// 	setSimilarQuestionAnswerCorrect('correct')
			// 	if (Object.values(similarQuestions).length > (similarQuestionIndex + 1)) {
			// 	} else {
			// 		setFinishedSimilarQuestions(true)
			// 	}	
			// } else {
			// setSimilarQuestionAnswerCorrect('incorrect')
			// }
		}

		const showHint = async () => {
			setHintIndex(hintIndex == null ? 0 : (hintIndex + 1))
		}

		const nextSimilarQuestion = async () => {
			setHintIndex()
			setSimilarQuestionAnswerCorrect(null)
			setSimilarQuestionAnswer('')

			if (similarQuestions.length > (similarQuestionIndex + 1)) {
				setSimilarQuestionIndex(similarQuestionIndex + 1)
			} else {
				// setSimilarQuestions(null)
				// setSimilarQuestionIndex(null)
				// setFinishedSimilarQuestions(true)
			}
		}


		let markStatus;
		let simQuestion;
		if (similarQuestions != null && similarQuestionIndex >= 0) {
			simQuestion = Object.values(similarQuestions)[similarQuestionIndex];
			if (similarQuestionAnswerCorrect === 'correct') {
				// markStatus = <Typography gutterBottom>Correct!</Typography>
				markStatus = <Typography style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 3 }}>Your answer is correct!</Typography>
			} else if (similarQuestionAnswerCorrect === 'incorrect') {
				markStatus = <Typography style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 3 }}>Please try again</Typography>
			}
		} else {
			return <Box></Box>
		}

		const answerSteps = Object.values(similarQuestions[similarQuestionIndex].answer)

		return (
			<Box
				// minHeight="100vh"
				// minWidth="100vw"
				sx={{ display: 'flex', flexDirection: 'column', zIndex: 12, alignItems: 'center', justifyContent: 'center', position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#fff6f1' }}
			>
				<Paper elevation={8} sx={{ margin: '1rem', padding: isLargeScreen ? '2em' : '1em', width: isLargeScreen ? 500 : '80%', borderRadius: 5, backgroundColor: 'white' }}>
					{/* <Box>
						<Typography textAlign={'center'} gutterBottom>Solution for {question}</Typography>
					</Box> */}

					{showWait &&
						<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
							<Box paddingBottom={2}>
								<Typography textAlign={'center'} fontSize={20}>Processing</Typography>
							</Box>
							<CircularProgress value={25} />
						</Box>
					}

					<Box>
						<Typography sx={{ fontSize: 24, fontWeight: 'bold', paddingBottom: 2 }}>Question {similarQuestionIndex + 1}</Typography>
						<Typography style={{ fontFamily: 'Katex', fontWeight: 'bold', fontSize: isLargeScreen ? 20 : 20 }}>{simQuestion.question}</Typography>
					</Box>
					{hintIndex >= 0 &&
						<Box sx={{ flexDirection: 'column', paddingTop: 2 }} display={'flex'}>
							<Typography style={{ color: 'green', fontWeight: 'bold', fontSize: isLargeScreen ? 16 : 16, paddingBottom: 3 }}>Hints</Typography>
							{answerSteps.map((hint, index) => {
								if (hintIndex >= index) {
									return (
										<Box key={index} className="hintStep">
											<Box sx={{ width: 3, height: 24, backgroundColor: 'green', marginRight: 1 }}></Box><Typography style={{ fontFamily: 'Katex', fontSize: isLargeScreen ? 18 : 18 }}>{hint}</Typography>
										</Box>
									)
								}
							})}
						</Box>}
					{similarQuestionAnswerCorrect === 'correct' ?
						<Box sx={{ flexDirection: 'column', paddingTop: 2 }} display={'flex'} >
							<Typography style={{ color: 'Blue', fontWeight: 'bold', fontSize: isLargeScreen ? 16 : 16, paddingBottom: 3 }}>Answer</Typography>
							<Typography style={{ fontFamily: 'Katex', fontSize: isLargeScreen ? 18 : 18 }}>{similarQuestionAnswer}</Typography>
						</Box> :
						<Box sx={{ flexDirection: 'column', paddingTop: 2 }} display={'flex'} >
							<TextField
								ref={answerRef}
								label="Answer"
								value={similarQuestionAnswer}
								onChange={(event) => {
									setSimilarQuestionAnswer(event.target.value);
								}}
							// value={similarQuestionAnswer} 
							// onChange={(e) => setSimilarQuestionAnswer(e.target.value)} 
							/>
						</Box>}
					<Box sx={{ flexDirection: 'column', paddingTop: 2 }} display={'flex'} >
						{markStatus}
					</Box>
					{similarQuestionAnswerCorrect === 'correct' ?
						finishedSimilarQuestions ?
							<Box sx={{ paddingTop: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }} >
								<Button variant="contained" size='large' onClick={restart} disabled={similarQuestionAnswer != null ? false : true}>Finish</Button>
								<Button variant="contained" size='large' onClick={createMoreQuestions} disabled={similarQuestionAnswer != null ? false : true}>More Questions</Button>
							</Box>
							:
							<Box sx={{ paddingTop: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }} >
								<Button variant="contained" size='large' onClick={nextSimilarQuestion} disabled={similarQuestionAnswer != null ? false : true}>Next Question</Button>
							</Box>
						:
						<Box sx={{ paddingTop: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }} >
							<Button sx={{
								color: 'green', borderColor: 'green', "&:hover": {
									backgroundColor: `rgba(0,128,0,.1)`
								}
							}} variant="outlined" size='large' onClick={showHint}
								disabled={hintIndex === (Object.values(similarQuestions[similarQuestionIndex].answer).length - 1) ? true : false}
							>Hint</Button>
							<Button variant="contained" size='large' onClick={verifyAnswer} disabled={showWait ? true : false}>Submit</Button>
						</Box>}
				</Paper>
			</Box>
		)
	}


	if (showInprogress) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="100vh"
				minWidth="100vw"
				sx={{ flexDirection: 'column' }}
			>
				<Box paddingBottom={2}>
					<Typography textAlign={'center'} fontSize={20}>Processing</Typography>
				</Box>
				<CircularProgress value={25} />
			</Box>)
	}

	if (answer != null) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="100vh"
				minWidth="100vw"
				sx={{ flexDirection: 'column' }}
			>
				<Paper elevation={2} sx={{ margin: '1rem', padding: '1rem', minWidth: isLargeScreen ? 400 : '80%' }}>
					{/* <Box>
						<Typography textAlign={'center'} gutterBottom>Solution for {question}</Typography>
					</Box> */}
					<Box>
						<Typography variant="h5" component="h6" textAlign={'center'} gutterBottom>Solution for {question}</Typography>
					</Box>
					{Object.keys(answer).map((step, index) => {
						return (
							<Box key={index} sx={{ flexDirection: 'column' }} display={'flex'} >
								{/* <Typography variant="caption" component="caption" gutterBottom>Step {index + 1}</Typography> */}
								<Typography gutterBottom>{answer[step]}</Typography>
							</Box>
						)
					})}
					<Box sx={{ paddingTop: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }} >
						<Button variant="contained" size='large' onClick={restart} disabled={similarQuestionAnswer != null ? false : true}>Done</Button>
						<Button variant="contained" size='large' onClick={createMoreQuestions} disabled={similarQuestionAnswer != null ? false : true}>Similar Questions</Button>
					</Box>

				</Paper>
			</Box>
		);
	}

	// let markStatus;
	// if (similarQuestions != null && similarQuestionIndex >= 0) {
	// 	const simQuestion = Object.values(similarQuestions)[similarQuestionIndex];
	// 	if (similarQuestionAnswerCorrect === 'correct') {
	// 		markStatus = <Typography gutterBottom>Correct!</Typography>
	// 	} else if (similarQuestionAnswerCorrect === 'incorrect') {
	// 		markStatus = <Typography gutterBottom>Try again</Typography>
	// 	}
	// }

	// 	return (
	// 		<Box
	// 			display="flex"
	// 			justifyContent="center"
	// 			alignItems="center"
	// 			minHeight="100vh"
	// 			minWidth="100vw"
	// 			sx={{ flexDirection: 'column' }}
	// 		>
	// 			<Paper elevation={2} sx={{ margin: '1rem', padding: '1rem', minWidth: isLargeScreen ? 400 : '80%' }}>
	// 				{/* <Box>
	// 					<Typography textAlign={'center'} gutterBottom>Solution for {question}</Typography>
	// 				</Box> */}
	// 				<Box>
	// 					<Typography variant="h5" component="h6" textAlign={'center'} gutterBottom>{simQuestion.question}</Typography>
	// 				</Box>
	// 				{hintIndex >= 0 ?
	// 					<Box sx={{ flexDirection: 'column' }} display={'flex'}>
	// 						<Typography gutterBottom>Hints</Typography>
	// 						{Object.values(Object.values(similarQuestions)[similarQuestionIndex].answer).map((hint, index) => {
	// 							if (hintIndex >= index) {
	// 								return (
	// 									<Typography key={`hint-${index}`} gutterBottom>{hint}</Typography>
	// 								)
	// 							}
	// 						})}
	// 						{/* <Typography gutterBottom>{Object.values(Object.values(similarQuestions)[similarQuestionIndex].answer)[hintIndex]}</Typography> */}
	// 					</Box> : null}
	// 				{similarQuestionAnswerCorrect === 'correct' ?
	// 					<Box sx={{ flexDirection: 'column', paddingTop: 2 }} display={'flex'} >
	// 						<Typography gutterBottom>Answer: {similarQuestionAnswer}</Typography>
	// 					</Box> :
	// 					<Box sx={{ flexDirection: 'column', paddingTop: 2 }} display={'flex'} >
	// 						<TextField ref={answerRef} label="Answer" value={similarQuestionAnswer} onChange={(e) => setSimilarQuestionAnswer(e.target.value)} />
	// 					</Box>}
	// 				<Box sx={{ flexDirection: 'column', paddingTop: 2 }} display={'flex'} >
	// 					{markStatus}
	// 				</Box>
	// 				{similarQuestionAnswerCorrect === 'correct' ?
	// 					finishedSimilarQuestions ?
	// 						<Box sx={{ paddingTop: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }} >
	// 							<Button variant="contained" size='large' onClick={restart} disabled={similarQuestionAnswer != null ? false : true}>Done</Button>
	// 							<Button variant="contained" size='large' onClick={createMoreQuestions} disabled={similarQuestionAnswer != null ? false : true}>More Questions</Button>
	// 						</Box>
	// 						:
	// 						<Box sx={{ paddingTop: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }} >
	// 							<Button variant="contained" size='large' onClick={nextSimilarQuestion} disabled={similarQuestionAnswer != null ? false : true}>Next Question</Button>
	// 						</Box>
	// 					:
	// 					<Box sx={{ paddingTop: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }} >
	// 						<Button variant="outlined" size='large' onClick={showHint} disabled={hintIndex === Object.values(Object.values(similarQuestions)[similarQuestionIndex].answer).length ? true : false}>Hint</Button>
	// 						<Button variant="contained" size='large' onClick={verifyAnswer} disabled={similarQuestionAnswer != null && similarQuestionAnswer != '' ? false : true}>Submit</Button>
	// 					</Box>}
	// 			</Paper>
	// 		</Box>
	// 	);
	// }

	if (useCamera) {
		console.log('RENDER MAIN');
		return (
			<Box>
				<SimilarQuestions />

				{/* question frame */}
				<Box sx={{ zIndex: 10, position: 'fixed', top: isLargeScreen ? '7em' : '4em', display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
					<Box sx={{ width: isLargeScreen ? '60%' : '90%', height: isLargeScreen ? '30vh' : '25vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
						{/* top */}
						<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
							<Box sx={{
								top: isLargeScreen ? 50 : 25,
								left: isLargeScreen ? 50 : 25,
								width: isLargeScreen ? 50 : 25,
								height: isLargeScreen ? 50 : 25,
								background: 'transparent',
								borderLeft: '6px solid white',
								borderTop: '6px solid white',
								borderTopLeftRadius: 10,
							}} />
							<Box sx={{
								top: isLargeScreen ? 50 : 25,
								right: isLargeScreen ? 50 : 25,
								width: isLargeScreen ? 50 : 25,
								height: isLargeScreen ? 50 : 25,
								background: 'transparent',
								borderRight: '6px solid white',
								borderTop: '6px solid white',
								borderTopRightRadius: 10,
							}} />
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<Typography variant="h5" component="h5" color='white'>+</Typography>
						</Box>
						{/* bottom */}
						<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
							<Box sx={{
								top: isLargeScreen ? 50 : 25,
								left: isLargeScreen ? 50 : 25,
								width: isLargeScreen ? 50 : 25,
								height: isLargeScreen ? 50 : 25,
								background: 'transparent',
								borderLeft: '6px solid white',
								borderBottom: '6px solid white',
								borderBottomLeftRadius: 10,
							}} />
							{/* bottom right */}
							<Box sx={{
								top: isLargeScreen ? 50 : 25,
								right: isLargeScreen ? 50 : 25,
								width: isLargeScreen ? 50 : 25,
								height: isLargeScreen ? 50 : 25,
								background: 'transparent',
								borderRight: '6px solid white',
								borderBottom: '6px solid white',
								borderBottomRightRadius: 10,
							}} />
						</Box>
					</Box>
				</Box>


				{/* solution panel */}
				<Box
					className={showResults ? "resultsContainer" : "resultsContainer.animated"}
				>
					<Box sx={{
						maxWidth: isLargeScreen ? 500 : '85%',
						// minHeight: 200,
						maxHeight: isLargeScreen ? '80vh' : '90vh',
						// height: isLargeScreen ? 100 : 30,
						backgroundColor: 'white',
						overflow: 'hidden',
						borderRadius: 5,
						// padding: '1.5em',
						overflowY: 'auto',
						display: "flex",
						// flexGrow: 1,
						flex: 1,
						// width: '90%',
						flexDirection: "column",
						// maxHeight:"200px",
						padding: isLargeScreen ? '2em' : '1em',
					}}>

						{/* {isCameraReady && <Box sx={{ position: 'fixed', right: 10, top: 10 }}>
							<IoCloseCircleOutline size="2em" onClick={resetQuestion} />
						</Box>} */}
						{isCameraReady && !questionLatex && <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
							<IoCloseCircleOutline size="2em" onClick={restart} />
						</Box>}

						{isCameraReady && !questionLatex && <Spinner />}

						{questionLatex &&
							<Box>
								{solution ?
									<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 1 }}>
										<Typography sx={{ fontSize: 24, fontWeight: 'bold' }} textAlign={'center'}>Steps For Solving</Typography>
										<IoCloseCircleOutline size="2em" onClick={restart} style={{ zIndex: 11 }} />
									</Box> :
									<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 1 }}>
										<Box sx={{ display: 'flex', flexDirection: 'row' }}>
											{/* <CircularProgress size={15} /> */}
											{/* <Typography sx={{ paddingLeft: 1 }} textAlign={'center'}>SOLVING...</Typography> */}
											<Typography sx={{ fontSize: 24, fontWeight: 'bold' }} textAlign={'center'}>AI Is Solving</Typography>
										</Box>
										<IoCloseCircleOutline size="2em" onClick={restart} />
									</Box>}

								<Box className="questionStep">
									<math-field
										readOnly
										style={{ width: '90%', fontSize: 20, fontWeight: 'bold', border: '1px solid rgba(128,128,128,0)' }}
										ref={mathFieldRef}
										onInput={(evt) => setQuestionLatex(evt.target.value)}
									>{questionLatex}</math-field>
								</Box></Box>}

						{questionLatex && !solution && <Box sx={{ paddingTop: 2, display: 'flex', justifyContent: 'center' }}><CircularProgress size={25} /></Box>}
						{/* {questionLatex && <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 1 }}>
							<Button variant="contained" size='large' onClick={createSimilarQuestions}>Create Similar Questions</Button>
						</Box>} */}

						<SolutionSteps />

						{questionLatex && solution && <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 2, paddingBottom: 2 }}>
							<Button variant="contained" size='large' onClick={createSimilarQuestions}>Create Similar Questions</Button>
						</Box>}
					</Box>
				</Box>

				{isCameraReady && !cameraImage &&
					<Box sx={{
						position: 'fixed',
						display: 'flex',
						bottom: isLargeScreen ? '15em' : 120,
						width: '100vw',
						height: 50,
						zIndex: 10,
						alignItems: 'center',
						justifyContent: 'center',
					}}>
						<Typography color='white' fontWeight={'bold'}>Take a photo of a math problem</Typography>
					</Box>}


				{/* shutter button */}
				{isCameraReady && !cameraImage &&
					<Box sx={{
						position: 'fixed',
						display: 'flex',
						bottom: isLargeScreen ? '8em' : 25,
						width: '100vw',
						height: 100,
						// left: '50vw',
						// width: isLargeScreen ? 100 : 25,
						// height: isLargeScreen ? 100 : 25,
						zIndex: 10,
						// background: 'red',
						// borderRadius: 50,
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						{/* <Box sx={{ 
						width: isLargeScreen ? 100 : 30,
						height: isLargeScreen ? 100 : 30,
						backgroundColor: 'red',
						borderRadius: isLargeScreen ? 50 : 15,
						}}>

						</Box> */}
						{/* <Box class="round-button"></Box> */}
						<div onClick={takePhotoOfQuestion} className="round-button2">
							<div className="round-button"></div>
						</div>
					</Box>}

				{/* <Box sx={{
					position: 'fixed',
					display: 'flex',
					top: 0,
					left: 0,
					width: 200,
					height: 200,
					// left: '50vw',
					// width: isLargeScreen ? 100 : 25,
					// height: isLargeScreen ? 100 : 25,
					zIndex: 10,
					// background: 'red',
					// borderRadius: 50,
				}}>
					{cameraImage && <img src={cameraImage} alt='Taken photo' />}
				</Box> */}
				{/* <Box sx={{
					position: 'fixed',
					display: 'flex',
					top: 0,
					left: 0,
					width: 300,
					height: 300,
					zIndex: 10,
				}}>
					<math-field
						style={{ width: "300px", margin: "auto" }}
						ref={mathFieldRef}
						onInput={(evt) => setQuestionLatex(evt.target.value)}
					>{questionLatex}</math-field>
				</Box> */}

				{/* <Camera
					ref={cameraRef}
					videoReadyCallback={() => { setIsCameraReady(true) }}
				>
				</Camera> */}

				<Webcam
					audio={false}
					screenshotFormat="image/jpeg"
					videoConstraints={{
						height: browserHeight,
						width: browserWidth,
						facingMode: "environment"
					}}
					minScreenshotHeight={browserHeight}
					minScreenshotWidth={browserWidth}
					ref={cameraRef}
					onUserMedia={() => { setIsCameraReady(true) }}
					onUserMediaError={(e) => { console.log(e) }}
					style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, right: 0, bottom: 0, objectFit: "cover", objectPosition: "center" }}
				/>


				{cameraImage && <Box sx={{
					zIndex: 9, position: 'fixed',
					display: 'flex',
					top: 0, left: 0, right: 0, bottom: 0
				}}><img src={cameraImage} alt='Taken photo' /></Box>}
			</Box>
		)
	}

	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			minHeight="100vh"
			minWidth="100vw"
			maxHeight="100vh"
			maxWidth="100vw"
			sx={{ flexDirection: 'column' }}
		>
			<Box>
				<Typography variant="h5" component="h5" gutterBottom>Enter your question</Typography>
			</Box>
			<Box display="flex" justifyContent="center" alignItems="center">
				<CustomTextareaAutosize
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
					ref={questionInputRef}
					minRows={1}
					style={{ width: isLargeScreen ? 400 : '80%', fontSize: '1.75rem', padding: 20, textAlign: 'center' }} />
			</Box>
			<Box display="flex" sx={{ paddingTop: 2 }}>
				<Button variant="contained" size='large' onClick={solveQuestion} style={{ marginRight: 10 }}>Solve It!</Button>
				<Button variant="contained" size='large' onClick={createSimilarQuestions}>Similar Questions</Button>
			</Box>
		</Box>
	);
}