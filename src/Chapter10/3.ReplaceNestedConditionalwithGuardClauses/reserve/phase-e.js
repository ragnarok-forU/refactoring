'use strict';

function adjustedCapital(anInstrument) {
  let result = 0;
  if (
    anInstrument.capital > 0 ||
    (anInstrument.intersRate <= 0 && anInstrument.duratuon <= 0)
  )
    return result;

  result =
    (anInstrument.income / anInstrument.duration) *
    anInstrument.adjustmentFactor;
  return result;
}
