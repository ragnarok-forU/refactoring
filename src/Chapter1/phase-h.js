'use strict';

const invoice = require('./invoices.json');
const plays = require('./plays.json');

/**====================================================
 * 함수 선언 바꾸기
 * @param {object[]} invoice
 * @param {object} plays
 * @returns {string}
 * @description
 * 다양한 연극을 외주로 받아서 공연하는 극단이 있다고 생각해보자.
 * 공연 요청이 들어오면 연극의 장르와 관객 규모를 기초로 비용을 책정한다.
 * 현재 이 극단은 두 가지 장르, 비극과 희극만 공연한다. 그리고 공연료와
 * 별개로 포인트를 지급해서 다음번 의뢰 시 공연료를 할인받을 수도 있다.
 */
function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice[0].customer})\n`;

  for (let perf of invoice[0].performances) {
    volumeCredits += volumeCreditsFor(perf);

    // format -> usd, 단위 제거
    // eslint-disable-next-line prettier/prettier
    result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf);
  }
  result += `총액: ${usd(totalAmount)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}

function amountFor(aPerformance) {
  let result = 0;
  switch (playFor(aPerformance).type) {
    case 'tragedy':
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case 'comedy':
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 1000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
  }
  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function volumeCreditsFor(aPerformance) {
  let result = 0;
  result += Math.max(aPerformance.audience - 30, 0);
  if ('comedy' === playFor(aPerformance).type)
    result += Math.floor(aPerformance.audience / 5);
  return result;
}

// 함수 이름 변경 format -> usd
function usd(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber / 100); // 단위 변환 로직도 함수 안으로 이동
}

const result = statement(invoice, plays);
console.log(result);
