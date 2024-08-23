import * as React from 'react';
import { useState, useRef, useEffect } from 'react'
import { css } from '@emotion/react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card'
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from "axios";
import { Camera } from "react-camera-pro";
import { IoCloseCircleOutline } from "react-icons/io5";
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
const TEST_TIMEOUT = 5000

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

	const [useCamera, setUseCamera] = useState(true)
	const [isCameraReady, setIsCameraReady] = useState(false)
	const [question, setQuestion] = useState("7 + 2x = 12 - 3x")
	const [questionLatex, setQuestionLatex] = useState("")
	const [answer, setAnswer] = useState()
	const [similarQuestions, setSimilarQuestions] = useState()
	const [similarQuestionIndex, setSimilarQuestionIndex] = useState()
	const [hintIndex, setHintIndex] = useState();
	const [similarQuestionAnswer, setSimilarQuestionAnswer] = useState('')
	const [similarQuestionAnswerCorrect, setSimilarQuestionAnswerCorrect] = useState()
	const [finishedSimilarQuestions, setFinishedSimilarQuestions] = useState()
	const [cameraImage, setCameraImage] = useState()
	const [solution, setSolution] = useState(null)
	const [showSolutionOptions, setShowSolutionOptions] = useState(false)
	const [showResults, setShowResults] = useState(false)
	const [showInprogress, setShowInprogress] = useState(false)

	const questionInputRef = useRef();
	const answerRef = useRef();
	const cameraRef = useRef();
	const mathFieldRef = useRef();

	useEffect(() => {
		if (mathFieldRef.current) {
			mathFieldRef.current.mathVirtualKeyboardPolicy = "manual";
			mathFieldRef.current.addEventListener("focusin", (evt) =>
				window.mathVirtualKeyboard.show()
			);
			mathFieldRef.current.addEventListener("focusout", (evt) =>
				window.mathVirtualKeyboard.hide()
			);
		}
	}, []);


	useEffect(() => {
		questionInputRef.current?.focus();
		answerRef.current?.focus();
	});

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
		const answerStr = '{ "question": "Solve for x: 7 + 2x = 12 - 3x", "answer": { "step1": "Combine like terms on both sides of the equation:", "step2": "7 + 2x + 3x = 12 - 3x + 3x", "step3": "Combine like terms:", "step4": "7 + 5x = 12", "step5": "Subtract 7 from both sides of the equation:", "step6": "7 + 5x - 7 = 12 - 7", "step7": "Combine like terms:", "step8": "5x = 5", "step9": "Divide both sides of the equation by 5:", "step10": "5x / 5 = 5 / 5", "step11": "Simplify:", "step12": "x = 1" }}'
		const a = JSON.parse(answerStr)
		setTimeout(() => { setAnswer(a.answer); setShowInprogress(false) }, TEST_TIMEOUT)
	}

	const createSimilarQuestions = async () => {
		setShowInprogress(true)
		console.log('create similar question for: ', question);
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
		const sqStr = '{ "question1": { "question": "Solve for x: 5 + 3x = 10 - 2x", "answer": { "step1": "Combine like terms: 5 + 3x = 10 - 2x", "step2": "Move the variable terms to one side: 3x + 2x = 10 - 5", "step3": "Combine like terms: 5x = 5", "step4": "Divide both sides by 5: x = 1"} }, "question2": { "question": "Solve for x: 4 - 5x = 9 + 2x", "answer": { "step1": "Combine like terms: 4 - 5x = 9 + 2x", "step2": "Move the variable terms to one side: -5x - 2x = 9 - 4", "step3": "Combine like terms: -7x = 5", "step4": "Divide both sides by -7: x = -5/7" } }, "question3": { "question": "Solve for x: 2x + 3 = 5x - 1", "answer": { "step1": "Combine like terms: 2x + 3 = 5x - 1", "step2": "Move the variable terms to one side: 2x - 5x = -1 - 3", "step3": "Combine like terms: -3x = -4", "step4": "Divide both sides by -3: x = 4/3"}}}'
		const sq = JSON.parse(sqStr)
		setTimeout(() => { setSimilarQuestions(sq); setSimilarQuestionIndex(0); setShowInprogress(false) }, TEST_TIMEOUT)
	}

	const verifyAnswer = async () => {
		setSimilarQuestionAnswerCorrect('correct')

		if (Object.values(similarQuestions).length > (similarQuestionIndex + 1)) {
		} else {
			// setSimilarQuestions(null)
			// setSimilarQuestionIndex(null)
			setFinishedSimilarQuestions(true)
		}
	}

	const showHint = async () => {
		setHintIndex(hintIndex == null ? 0 : (hintIndex + 1))
	}

	const nextSimilarQuestion = async () => {
		setHintIndex()
		setSimilarQuestionAnswerCorrect(null)
		setSimilarQuestionAnswer('')

		if (Object.values(similarQuestions).length > (similarQuestionIndex + 1)) {
			setSimilarQuestionIndex(similarQuestionIndex + 1)
		} else {
			// setSimilarQuestions(null)
			// setSimilarQuestionIndex(null)
			// setFinishedSimilarQuestions(true)
		}
	}

	const restart = async () => {
		setAnswer()
		setSimilarQuestions()
		setSimilarQuestionIndex()
		setSimilarQuestionAnswer('')
		setFinishedSimilarQuestions()
		setSimilarQuestionAnswerCorrect()

		// resetQuestion()
	}

	const createMoreQuestions = async () => {
		setAnswer()
		setSimilarQuestions()
		setSimilarQuestionIndex()
		setSimilarQuestionAnswer('')
		setFinishedSimilarQuestions()
		setSimilarQuestionAnswerCorrect()
		createSimilarQuestions()
	}

	const takePhotoOfQuestion = async () => {
		const photo = cameraRef.current.takePhoto()
		setCameraImage(photo)

		// show bottom panel
		setShowResults(true)

		console.log('sending to mathpix!');
		// const req = {
		// 	"src": "https://mathpix-ocr-examples.s3.amazonaws.com/cases_hw.jpg",
		// 	"math_inline_delimiters": ["$", "$"], "rm_spaces": true
		// }
		// const res = await mathpix.post('/text', req)
		// console.log('Response from mathpix', res);
		// const question = res.data.latex_styled
		// console.log('question:', question);
		// setQuestionLatex(question)

		setTimeout(() => { setQuestionLatex("f(x)=\\left\\{\\begin{array}{ll}\nx^{2} & \\text { if } x<0 \\\\\n2 x & \\text { if } x \\geq 0\n\\end{array}\\right.") }, 1500)

		console.log('sending to openai/wolfram to solve')

		// setShowSolutionOptions(true)

		const answerStr = '{ "question": "Solve for x: 7 + 2x = 12 - 3x", "answer": { "step1": "Combine like terms on both sides of the equation:", "step2": "7 + 2x + 3x = 12 - 3x + 3x", "step3": "Combine like terms:", "step4": "7 + 5x = 12", "step5": "Subtract 7 from both sides of the equation:", "step6": "7 + 5x - 7 = 12 - 7", "step7": "Combine like terms:", "step8": "5x = 5", "step9": "Divide both sides of the equation by 5:", "step10": "5x / 5 = 5 / 5", "step11": "Simplify:", "step12": "x = 1" }}'
		const a = JSON.parse(answerStr)
		setTimeout(() => { setSolution(a) }, 5000)

		// setSolution("x = 1")


		// mathFieldRef.current.executeCommand("deleteAll")
		// // mathFieldRef.current.insert("f(x)=\\left\\{\\begin{array}{ll}\nx^{2} & \\text { if } x<0 \\\\\n2 x & \\text { if } x \\geq 0\n\\end{array}\\right.")
		// mathFieldRef.current.insert(question);
		// window.mathVirtualKeyboard.hide()
	}

	const Spinner = () => {
		return (
			<Box>
				<Box paddingBottom={2}>
					<Typography textAlign={'center'}>Processing</Typography>
				</Box>
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<CircularProgress value={25} />
				</Box>
			</Box>
		)
	}

	const SolutionSteps = () => {
		if (solution == null) {
			return (<Box />)
		}

		let steps = []
		Object.keys(solution.answer).map((step, index) => {
			steps.push(
				<Box key={index} className="solutionStep" >
					<Typography>{solution.answer[step]}</Typography>
				</Box>
			)
		})
		return steps
	}

	const resetQuestion = () => {
		setSolution(null)
		setQuestionLatex(null)
		setShowResults(false)
		setCameraImage(null)
	}

	// render


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
					<Typography textAlign={'center'}>Processing</Typography>
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

	if (similarQuestions != null && similarQuestionIndex >= 0) {
		const simQuestion = Object.values(similarQuestions)[similarQuestionIndex];
		let markStatus;
		if (similarQuestionAnswerCorrect === 'correct') {
			markStatus = <Typography gutterBottom>Correct!</Typography>
		} else if (similarQuestionAnswerCorrect === 'incorrect') {
			markStatus = <Typography gutterBottom>Try again</Typography>
		}

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
						<Typography variant="h5" component="h6" textAlign={'center'} gutterBottom>{simQuestion.question}</Typography>
					</Box>
					{hintIndex >= 0 ?
						<Box sx={{ flexDirection: 'column' }} display={'flex'}>
							<Typography gutterBottom>Hints</Typography>
							{Object.values(Object.values(similarQuestions)[similarQuestionIndex].answer).map((hint, index) => {
								if (hintIndex >= index) {
									return (
										<Typography key={`hint-${index}`} gutterBottom>{hint}</Typography>
									)
								}
							})}
							{/* <Typography gutterBottom>{Object.values(Object.values(similarQuestions)[similarQuestionIndex].answer)[hintIndex]}</Typography> */}
						</Box> : null}
					{similarQuestionAnswerCorrect === 'correct' ?
						<Box sx={{ flexDirection: 'column', paddingTop: 2 }} display={'flex'} >
							<Typography gutterBottom>Answer: {similarQuestionAnswer}</Typography>
						</Box> :
						<Box sx={{ flexDirection: 'column', paddingTop: 2 }} display={'flex'} >
							<TextField ref={answerRef} label="Answer" value={similarQuestionAnswer} onChange={(e) => setSimilarQuestionAnswer(e.target.value)} />
						</Box>}
					<Box sx={{ flexDirection: 'column', paddingTop: 2 }} display={'flex'} >
						{markStatus}
					</Box>
					{similarQuestionAnswerCorrect === 'correct' ?
						finishedSimilarQuestions ?
							<Box sx={{ paddingTop: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }} >
								<Button variant="contained" size='large' onClick={restart} disabled={similarQuestionAnswer != null ? false : true}>Done</Button>
								<Button variant="contained" size='large' onClick={createMoreQuestions} disabled={similarQuestionAnswer != null ? false : true}>More Questions</Button>
							</Box>
							:
							<Box sx={{ paddingTop: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }} >
								<Button variant="contained" size='large' onClick={nextSimilarQuestion} disabled={similarQuestionAnswer != null ? false : true}>Next Question</Button>
							</Box>
						:
						<Box sx={{ paddingTop: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }} >
							<Button variant="outlined" size='large' onClick={showHint} disabled={hintIndex === Object.values(Object.values(similarQuestions)[similarQuestionIndex].answer).length ? true : false}>Hint</Button>
							<Button variant="contained" size='large' onClick={verifyAnswer} disabled={similarQuestionAnswer != null && similarQuestionAnswer != '' ? false : true}>Submit</Button>
						</Box>}
				</Paper>
			</Box>
		);
	}


	if (useCamera) {
		return (
			<Box>
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
						maxHeight: isLargeScreen ? '50vh' : '60vh',
						// height: isLargeScreen ? 100 : 30,
						backgroundColor: 'white',
						borderRadius: 5,
						// padding: '1.5em',
						overflowY: 'auto',
						display: "flex",
						// flexGrow: 1,
						flex: 1,
						// width: '90%',
						flexDirection: "column",
						// maxHeight:"200px",
						padding: '1em',
					}}>

						{/* {isCameraReady && <Box sx={{ position: 'fixed', right: 10, top: 10 }}>
							<IoCloseCircleOutline size="2em" onClick={resetQuestion} />
						</Box>} */}
						{isCameraReady && !questionLatex && <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
							<IoCloseCircleOutline size="2em" onClick={resetQuestion} />
						</Box>}

						{isCameraReady && !questionLatex && <Spinner />}

						{questionLatex &&
							<Box>
								{solution ?
									<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
										<Typography textAlign={'center'}>STEPS FOR SOLVING</Typography>
										<IoCloseCircleOutline size="2em" onClick={resetQuestion} />
									</Box> :
									<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
										<Box sx={{ display: 'flex', flexDirection: 'row' }}>
											<CircularProgress size={15} />
											<Typography sx={{ paddingLeft: 1 }} textAlign={'center'}>SOLVING...</Typography>
										</Box>
										<IoCloseCircleOutline size="2em" onClick={resetQuestion} />
									</Box>}

								<Box className="questionStep">
									<math-field
										// readOnly
										style={{ width: '100%', fontSize: 20, fontWeight: 'bold', borderRadius: 3 }}
										ref={mathFieldRef}
										onInput={(evt) => setQuestionLatex(evt.target.value)}
									>{questionLatex}</math-field>
								</Box></Box>}

						{questionLatex && <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 1 }}>
							{/* <Button variant="contained" size='large' onClick={solveQuestion} style={{ marginRight: 10 }}>Show Solution</Button> */}
							<Button variant="contained" size='large' onClick={createSimilarQuestions}>Create Similar Questions</Button>
						</Box>}

						<SolutionSteps />

					</Box>
				</Box>


				{/* shutter button */}
				{isCameraReady && !cameraImage &&
					<Box sx={{
						position: 'fixed',
						display: 'flex',
						bottom: isLargeScreen ? '10em' : 25,
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

				<Camera
					ref={cameraRef}
					videoReadyCallback={() => { setIsCameraReady(true) }}
				>
				</Camera>
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