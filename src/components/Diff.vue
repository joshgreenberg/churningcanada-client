<template>
  <div class="diff">
    <div class="diff-table">
      <div class="diff-removed">
        <span
          v-for="(phrase, i) in diffRemoved"
          :key="i"
          :class="{'diff-chunk-removed': phrase.removed}"
        >
          {{ phrase.value }}
        </span>
      </div>
      <div class="diff-added">
        <span
          v-for="(phrase, i) in diffAdded"
          :key="i"
          :class="{'diff-chunk-added': phrase.added}"
        >
          {{ phrase.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
const oldStr = `
1 Must apply online by March 2, 2020. Welcome Bonus of 15,000 Aeroplan Miles will be awarded to the Aeroplan Member account associated with the TD® Aeroplan® Visa Infinite* Card Account (“Account”) only after the first Purchase is made on the Account. Rebate of the Annual Fee is for the first year for the Primary Cardholder only and will occur when you have applied for an Account by March 2, 2020. Annual Fee Rebate will be applied within 2 monthly statements from the date of Account opening. The Annual Fee for any Authorized User Cards added to the Account continues to apply. The Welcome Earn Bonus during the promotional period will be 5 additional Aeroplan Miles are earned for each $1.00 in Purchases of eligible gas, groceries, drugstore, and aircanada.com products and services (excluding Air Canada Vacations packages, car rentals, hotel bookings, and other third party partner products and services that can be purchased through aircanada.com) charged to your Account, and 5 additional Aeroplan Miles are earned for each $1.00 for all other Purchases charged to your Account. The Welcome Earn Bonus is in addition to the standard earn rate applicable to this Account. The Welcome Earn Bonus promotional period applies to new Accounts for the first 3 months. The Welcome Earn Bonus is subject to a maximum total collective earn of 5,000 Aeroplan Miles per month for all Purchases to the Account ("Welcome Earn Bonus Cap"). Once the Welcome Earn Bonus Cap is reached, any further Purchases made will earn Aeroplan Miles at the regular 1.5 Aeroplan Miles (Bonus Rate) that applies to each $1.00 in Purchases of eligible gas, groceries, drugstore, and aircanada.com products and services (excluding Air Canada Vacations packages, car rentals, hotel bookings, and other third party partner products and services that can be purchased through aircanada.com) and 1 Aeroplan Mile that applies to each $1.00 in all other eligible Purchases. Any returned items, refunds, rebates or other similar credits on any Purchases will reduce or cancel the Aeroplan Miles earned at the Welcome Earn Bonus and the standard or Bonus Rate on the original Purchase, as applicable. If you have opened an Account in the last 6 months, you will not be eligible for this offer. We reserve the right to limit the number of Accounts opened by and the number of miles awarded to any one person. Offers may be changed, withdrawn or extended at any time and cannot be combined with any other offer unless otherwise specified. Welcome Bonus and additional miles earned through Welcome Earn Bonus are not eligible for Aeroplan status. Your Account must be in good standing at the time the Welcome Bonus and the Welcome Earn Bonus Aeroplan Miles are awarded. Please allow 8 weeks after the conditions for each offer are fulfilled for the Welcome Bonus and the Welcome Earn Bonus Aeroplan Miles to be credited to your Aeroplan Member account.\nThe number of Aeroplan Miles required for the destination is accurate as of December 2, 2019 and is subject to change at any time by Aeroplan Inc. According to Aeroplan's current reward chart, destinations reflect two short-haul Fixed Mileage Flight Reward® in Economy Class departing from within Canada or the continental US (plus applicable fees and taxes). Fixed Mileage Flight Reward availability is capacity controlled and is subject to availability at time of booking as well as seasonality of demand. Aeroplan Flight Rewards are subject to taxes, landing and departure fees, and other charges and surcharges may apply. Aeroplan Partners, rules and regulations are subject to change without notice. For full details on Aeroplan's current reward chart, please visit aeroplan.com.\n2Primary Cardholder remains liable for all charges to the Account, including those made by an Authorized User.`.trim()
const newStr = `
1 Must apply by May 31, 2020. Welcome Bonus of 15,000 Aeroplan Miles will be awarded to the Aeroplan Member account associated with the TD® Aeroplan® Visa Infinite* Card Account (“Account”) only after the first Purchase is made on the Account. For a 3-month period following the opening of the Account (Promotion Period), in order to earn the Additional Bonus Aeroplan Miles, you must spend a minimum of $1,000 each month on Purchases (Monthly Minimum Spend) to receive the monthly 5,000 Additional Bonus Aeroplan Miles in any given month during the Promotion Period, for a total of 15,000 Aeroplan Miles. If you do not make the Monthly Minimum Spend in any month during the Promotion Period, you will not earn the monthly Additional Bonus Aeroplan Miles. Your Monthly Minimum Spend is not cumulative and will not carry forward to a subsequent month during the Promotion Period. Rebate of the Annual Fee is only for the first year for the Primary Cardholder and the 1st Additional Cardholder added to the Account. To receive the 1st Additional Cardholder Annual Fee Rebate you must add your first Additional Cardholder by June 1, 2020. Annual Fee Rebate will be applied within 2 monthly statements from the date of the statement with the first Annual Fee charge. The Annual Fee for any subsequent Additional Cardholders added to the Account continues to apply. Any returned items, refunds, rebates or other similar credits on any Purchases will reduce or cancel the Aeroplan Miles earned at the standard Rate on the original Purchase, as applicable. If you have opened an Account in the last 6 months, you will not be eligible for this offer. We reserve the right to limit the number of Accounts opened by and the number of miles awarded to any one person. Offers may be changed, withdrawn or extended at any time and cannot be combined with any other offer unless otherwise specified. Welcome Bonus and miles earned through the Additional Bonus Aeroplan Miles are not eligible for Aeroplan status. Your Account must be in good standing at the time the Welcome Bonus and the Additional Bonus Aeroplan Miles are awarded. Please allow 8 weeks after the conditions for each offer are fulfilled for the Welcome Bonus and the Additional Bonus Aeroplan Miles to be credited to your Aeroplan Member account.\nThe number of Aeroplan Miles required for the destination is accurate as of February 10, 2020 and is subject to change at any time by Aeroplan Inc. According to Aeroplan's current reward chart, destinations reflect two short-haul Fixed Mileage Flight Reward® in Economy Class departing from within Canada or the continental US (plus applicable fees and taxes). Fixed Mileage Flight Reward availability is capacity controlled and is subject to availability at time of booking as well as seasonality of demand. Aeroplan Flight Rewards are subject to taxes, landing and departure fees, and other charges and surcharges may apply. Aeroplan Partners, rules and regulations are subject to change without notice. For full details on Aeroplan's current reward chart, please visit aeroplan.com.\n2 Primary Cardholder remains liable for all charges to the Account, including those made by an Additional Cardholder.`.trim()

import patience from '@/../lib/patience'

export default {
  name: 'Diff',
  data() {
    return {
      oldStr,
      newStr,
    }
  },
  computed: {
    diff() {
      return patience(this.oldStr, this.newStr)
    },
    diffRemoved() {
      return this.diff.filter(d => !d.added)
    },
    diffAdded() {
      return this.diff.filter(d => !d.removed)
    },
  },
}
</script>

<style>
.diff-container {
  margin: 20px 10px;
}
.diff-table {
  width: 100%;
  display: flex;
}
.diff-table div {
  width: 50%;
  vertical-align: top;
}
.diff-table .diff-line-has-changes .diff-line-removed {
  background: rgb(255, 196, 193);
}
.diff-table .diff-line-has-changes .diff-line-added {
  background: rgb(181, 239, 219);
}
.diff-table .diff-chunk-removed {
  background: rgb(255, 137, 131);
}
.diff-table .diff-chunk-added {
  background: rgb(107, 223, 184);
}
</style>
