// ============================================
// NUSTOLOGY PREP - AGGREGATE CALCULATOR
// File: js/aggregate.js
// ============================================

const AGGREGATE = {
    // NUST Standard Weights
    WEIGHTS: {
        Engineering:  { net: 0.75, fsc: 0.15, matric: 0.10 },
        Medical:      { net: 0.75, fsc: 0.15, matric: 0.10 },
        Business:     { net: 0.75, fsc: 0.15, matric: 0.10 },
        Architecture: { net: 0.50, fsc: 0.15, matric: 0.10, ssat: 0.25 }
    },

    // ============ MAIN CALCULATOR ============
    calculate({ field, netScore, netTotal, fscScore, fscTotal, matricScore, matricTotal }) {
        if (
            isNaN(netScore) || isNaN(fscScore) || isNaN(matricScore) ||
            netScore > netTotal || fscScore > fscTotal || matricScore > matricTotal
        ) {
            return { success: false, message: 'Invalid input' };
        }

        const weights = this.WEIGHTS[field] || this.WEIGHTS.Engineering;
        const netPerc = (netScore / netTotal) * 100;
        const fscPerc = (fscScore / fscTotal) * 100;
        const matricPerc = (matricScore / matricTotal) * 100;

        const netWeight = netPerc * weights.net;
        const fscWeight = fscPerc * weights.fsc;
        const matricWeight = matricPerc * weights.matric;
        const aggregate = netWeight + fscWeight + matricWeight;

        return {
            success: true,
            aggregate: parseFloat(aggregate.toFixed(2)),
            breakdown: {
                netPerc: netPerc.toFixed(2),
                fscPerc: fscPerc.toFixed(2),
                matricPerc: matricPerc.toFixed(2),
                netWeight: netWeight.toFixed(2),
                fscWeight: fscWeight.toFixed(2),
                matricWeight: matricWeight.toFixed(2)
            },
            tier: this.getTier(aggregate),
            field
        };
    },

    // ============ MERIT TIER ============
    getTier(aggregate) {
        if (aggregate >= 85) return { level: 'excellent', label: 'Excellent - SEECS/SMME/SCEE Range' };
        if (aggregate >= 78) return { level: 'good',      label: 'Good - SCME/SNS Range' };
        if (aggregate >= 70) return { level: 'fair',      label: 'Fair - Other Programs' };
        if (aggregate >= 60) return { level: 'low',       label: 'Below Average' };
        return { level: 'low', label: 'Below Merit - Need More Work' };
    },

    // ============ NET BREAKDOWN HELPER ============
    getNETStructure(field) {
        const structures = {
            Engineering: {
                total: 200,
                subjects: { Mathematics: 80, Physics: 60, English: 30, Intelligence: 30 }
            },
            Medical: {
                total: 200,
                subjects: { Biology: 80, Chemistry: 60, Physics: 40, English: 20 }
            },
            Business: {
                total: 200,
                subjects: { Mathematics: 80, English: 50, Intelligence: 40, GeneralKnowledge: 30 }
            },
            Architecture: {
                total: 200,
                subjects: { English: 50, Mathematics: 50, Drawing: 60, GeneralKnowledge: 40 }
            }
        };
        return structures[field] || structures.Engineering;
    }
};

window.AGGREGATE = AGGREGATE;
