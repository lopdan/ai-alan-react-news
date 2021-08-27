import alanButton from '@alan-ai/alan-sdk-web';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './App.css';

import {
  useTooltip,
  TooltipWithBounds,
  defaultStyles as defaultToopTipStyles,
} from "@visx/tooltip";

import InfoBox from './components/InfoBox';
import LineChart from './components/LineChart';
import Placeholder from './components/Placeholder';

const alan_SDK_key = 'c1344b0e5cda4dfcd27bc949d44adcca2e956eca572e1d8b807a3e2338fdd0dc/stage';

const App = () => {
  const[dataValues, updateData] = useState({
    fetchingData: true,
    data: null,
    hoverLoc: null,
    activePoint: null
  })
	useEffect(() => {
		alanButton({
			key: alan_SDK_key,
			onCommand: ({ command }) => {
				if(command === 'testCommand'){
					alert('Test succesful');
				}
			}
		})
	}, [])

  useEffect(() => {
    const getData = () => {
        const url = 'https://api.coindesk.com/v1/bpi/historical/close.json';  
        fetch(url).then(r => r.json())
          .then((bitcoinData) => {
            const sortedData = [];
            let count = 0;
            for (let date in bitcoinData.bpi){
              sortedData.push({
                d: moment(date).format('MMM DD'),
                p: bitcoinData.bpi[date].toLocaleString('us-EN',{ style: 'currency', currency: 'USD' }),
                x: count, //previous days
                y: bitcoinData.bpi[date] // numerical price
              });
              count++;
            }
            updateData({
                data: sortedData,
                fetchingData: false
            })
          })
          .catch((e) => {
            console.log(e);
          });
      }
	  console.log(dataValues);
      getData();
  },[])
  console.log(dataValues);
    return (

      <div className='container'>
        <div className='row'>
          <h1>Bitcoin Price Chart</h1>
        </div>
        <div className='row'>
          { !dataValues.fetchingData ?
          <InfoBox data={dataValues.data} />
          : null }
        </div>
        <div className='row'>
          <div className='popup'>
            {dataValues.hoverLoc ? <Placeholder hoverLoc={dataValues.hoverLoc} activePoint={dataValues.activePoint}/> : null}
          </div>
        </div>
        <div className='row'>
          <div className='chart'>
            { !dataValues.fetchingData ?
              <LineChart data={dataValues.data} onChartHover={ (a,b) => updateData({hoverLoc: a, activePoint: b}) }/>
              : null }
          </div>
        </div>
        <div className='row'>
          <div id="coindesk"> Powered by Coindesk</div>
        </div>
      </div>

    );
}

export default App;