import React, {useEffect, useState, memo, useCallback} from 'react';
import {PageContainer} from '~/Components/Layout';
import RoundCounter from '~/Components/RoundCounter';
import Question from '~/Components/Quiz';
import GameTopInfo from '../../Components/GameTopInfo';
import Header from '~/Components/Header';
import {useGame} from '~/Contexts/GameContext';

function Game() {
  const {game, quiz, setQuiz, hubConnect} = useGame();

  const onQuestionRecived = useCallback((data) => {
    console.log('executed on recived');
    setQuiz({
      ...quiz,
      answers: [
        {text: data.answer1},
        {text: data.answer2},
        {text: data.answer3},
        {text: data.answer4},
      ],
      question: data.title,
    });
  }, []);
  useEffect(() => {
    console.log('assign match-start-question');
    hubConnect.on('match-start-question', onQuestionRecived);
    return () => {
      console.log('unassign match-start-question');
      hubConnect.off('match-start-question', onQuestionRecived);
    };
  }, [onQuestionRecived]);

  useEffect(() => {
    const listener = hubConnect.on('match-round-end', (data) => {
      console.log('match-round-end');
    });
    // return () => {
    //   socket.off('match-round-end', listener);
    // };
  }, []);
  return (
    <PageContainer>
      {game.showRoundScreen && (
        <RoundCounter
          actualRound={game.currentRound}
          totalRound={game.totalRound}
        />
      )}

      {game.showQuestionScreen && (
        <>
          {/* <Header close /> */}
          <GameTopInfo />
          <Question />
        </>
      )}
    </PageContainer>
  );
}

export default memo(Game);
