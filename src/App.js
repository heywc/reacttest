/**
 * @format
 * @Author: heywc “1842347744@qq.com”
 * @Date: 2022-07-08 14:09:07
 * @LastEditors: heywc “1842347744@qq.com”
 * @LastEditTime: 2022-07-13 16:27:07
 * @FilePath: /demo/reacttest/src/App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { useEffect, useRef, useState } from 'react';
import { Notice, Test } from 'ygl_busniess_end';
import { Player } from '@lottiefiles/react-lottie-player';
import './App.css';

function App() {
    useEffect(() => {
        let element = 0;
        // 模拟一个耗时的计算任务
        const start = performance.now();
        for (let i = 0; i < 1e9; i++) {}
        const end = performance.now();
        console.log(`Intensive task took ${end - start} ms`);
    }, []);
    const playerRef = useRef();
    // 开发播放
    const start = () => {
        playerRef.current.play();
    };
    // 停止播放
    const stop = () => {
        playerRef.current.stop();
    };

    const canvasRef = useRef(null);
    const [imageData, setImageData] = useState(null);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    setImageData(data);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };
    const handleProcessImage = () => {
        if (imageData) {
            const worker = new Worker(new URL('worker.js', import.meta.url));
            worker.postMessage(imageData);
            worker.onmessage = (event) => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.putImageData(event.data, 0, 0);
            };
            worker.onerror = (error) => {
                console.error('Worker error:', error);
            };
            return () => {
                worker.terminate();
            };
        }
    };

    return (
        <div className='App'>
            <Notice></Notice>
            <Test></Test>
            {/* lottie 动画 */}
            <div style={{ padding: '100px', background: '#FFD550' }}>
                <Player
                    ref={playerRef} // set the ref to your class instance
                    autoplay={true}
                    loop={true}
                    controls={true}
                    src={`https://static.1kmxc.com/tuling/json/扫码.json`}
                    // src={'https://assets3.lottiefiles.com/packages/lf20_XZ3pkn.json'}
                    style={{ height: '100px' }}></Player>
            </div>
            <button onClick={start}>开始播放</button>
            <button onClick={stop}>暂停播放</button>
            {/* work */}
            <div>
                <h1>Image Processing with Web Worker</h1>
                <input type='file' onChange={handleFileChange} />
                <canvas ref={canvasRef} width={500} height={500}></canvas>
                <button onClick={handleProcessImage}>Process Image</button>
            </div>
        </div>
    );
}

export default App;
