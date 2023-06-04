import { sprintf } from "sprintf-js";

const SineTable = [0, 225, 449, 671, 890, 1105, 1315, 1520,
    1719, 1910, 2093, 2267, 2431, 2585, 2728, 2859,
    2978, 3084, 3177, 3256, 3331, 3372, 3409, 3431, 3438]

const EccM = [32.0/360, 31.0/360, 7.0/80]
const EccS = [14.0/360, 14.0/360, 3.0/80]

const Rotations = [[4320000.0, 17937060.0, 7022376.0, 2296832.0, 364220.0, 146568.0, 57753336.0, 488203.0],
    [4320000.0, 17937000.0, 7022388.0, 2296824.0, 364220.0, 146564.0, 57753336.0, 488219.0],
    [4320000.0, 17937020.0, 7022388.0, 2296824.0, 364224.0, 146564.0, 57753336.0, 488219.0]];

const Ecc = [[14.0/360, 30.0/360, 12.0/360, 75.0/360, 33.0/360, 49.0/360, 32.0/360],
    [14.0/360, 28.0/360, 14.0/360, 70.0/360, 32.0/360, 60.0/360, 31.0/360],
    [3.0/80, 7.0/80, 4.0/80, 14.0/80, 7.0/80, 9.0/80, 7.0/80]];

const Ecc1 = [0.0, -2.0/80, -2.0/80, 4.0/80, 1.0/80, 4.0/80, 0.0];

const Mandocca = [[77.28, 220.45, 79.85, 130.04, 171.34, 236.61, 180.00],
    [80.00, 220.00, 80.00, 110.00, 160.00, 240.00, 180.00],
    [78.00, 210.00, 90.00, 118.00, 180.00, 236.00, 180.00]];

const Rho = [[0.0, 133.0/360, 262.0/360, 235.0/360, 70.0/360, 39.0/360, 0.0],
    [0.0, 132.0/360, 260.0/360, 234.0/360, 72.0/360, 40.0/360, 0.0],
    [0.0, 31.0/80, 59.0/80, 53.0/80, 16.0/80, 9.0/80, 0.0]];

const Rho1S = [0.0, -1.0/360, -2.0/360, -3.0/360, 2.0/360, 1.0/360, 0.0];

const Rho1 = [0.0, -2.0/80, -2.0/80, -2.0/80, -1.0/80, -1.0/80, 0.0];


const Ecc1S = [-20.0/360/60, -2.0/360, -1.0/360, -3.0/360, -1.0/360, -1.0/360, -20.0/360/60];

const Bija = [0.0, -16.0, -12.0, 0.0, -8.0, 12.0, 0.0, -4.0];
const KyPeriod = [1577917828.0, 1577917800.0, 1577917500.0];
const Deg2Rad = Math.PI/180

class Utils {
    static moonAnomaly (d, canon, anomMonth, synMonth) {
        var a2 = 0.0
        
        while (d < 0) d = d + anomMonth;
        d = d - parseInt(d / anomMonth) * anomMonth;
        d = d / anomMonth * 360 * 60;
        
        while (d < 0) d = d + 360*60;
        while (d >= 360*60) d = d - 360*60;			
                    
        var quadrant = parseInt(d / 60 / 90) + 1;

        if (d >= 180 * 60) d = 360 * 60 - d;
        if (d >= 90 * 60) d = 180 * 60 - d;

        var bigN = parseInt(d / 225);
        var delta = d - bigN * 225;
        
        var a1 = SineTable[bigN];
        if (bigN == 24) a2 = a1; 
        else a2 = SineTable[bigN + 1];
        var c = (a2 - a1) / 225;
        var s = a1 + c * delta;
        var p = EccM[canon] * s;
        var q = 20.0 / (60 * 360 * 3438.0) * s * s;
        if (canon > 0) q = 0;

        switch (quadrant) {
            case 1:
            case 2: 
                s = p - q;
                break;
            case 3:
            case 4: 
                s = -p + q;
                break;
                default:
                    //nothing
        }

        var i = -1;
        do
            i = i + 1;
        while (SineTable[i + 1] < s);
        
        s = (i + (s - SineTable[i]) / (SineTable[i + 1] - SineTable[i])) * 225;
        s = -s;
        return s / 60 / 360 * synMonth;
    }

    static sunAnomaly (d, calendar, degr, sidYear, synMonth) {
        var a2;
        //Sun anomaly, partly the same as HinduSine
        d = d - degr;						//Subtract offset
        if (d < 0) d = d + sidYear;
        if (d > sidYear) d = d - sidYear;
        d = d / sidYear * 360 * 60;
        
        while (d < 0) d = d + 360*60;
        while (d >= 360*60) d = d - 360*60;
                
        var quadrant = parseInt(d / 60 / 90) + 1;

        if (d >= 180 * 60) d = 360 * 60 - d;
        if (d >= 90 * 60) d = 180 * 60 - d;

        var bigN = parseInt(d / 225);
        var delta = d - bigN * 225;
        var a1 = SineTable[bigN];
        if (bigN == 24) a2 = a1; 
        else a2 = SineTable[bigN + 1];
        var gDiff = (a2 - a1) / 225;

        var s = a1 + gDiff * delta;
        var p = EccS[calendar] * s;
        var q = 20.0 / (60 * 360 * 3438.0) * s * s;
        if (calendar > 0) q = 0;

        switch (quadrant) {
            case 1:
            case 2: 
                s = p - q;
                break;
            case 3:
            case 4: 
                s = -p + q;
                break;
                default:
                    //nothing
        }

        var i = -1;
        do
            i = i + 1;
        while (SineTable[i + 1] < s);
        s = (i + (s - SineTable[i]) / (SineTable[i + 1] - SineTable[i])) * 225;

        s = -s;
        //gQ := s / p;
        return s / 60 / 360 * synMonth;
    }

    static meanLong(planet, calendar, d, hasBija) {
        //Sun, Merc, Ven, Mar, Jup Sat, Moon, Moon's apse
            if (calendar < 2) d = d + 0.25;//To sunrise

            var rot = Rotations[calendar][planet];
            if (hasBija && calendar == 0) rot = rot + Bija[planet]; 
            
            var temp = d * rot/KyPeriod[calendar]*360.0;
            if (planet == 7) temp = temp +90;
            return temp - parseInt(temp/360)*360;
        }

    
    static trueLong(planet, calendar, d, hasBija) {
        var sunMeanLong;
		var mean = Utils.meanLong(planet, calendar, d, hasBija);
		var argument = 0
        var eccentricity = 0
        var rhoB
        var nu1
        var nu2
        var nu3
        var temp; 
		if (planet == 6) { 
			var apse = Utils.meanLong(7, calendar, d, hasBija);
			argument = (mean - apse)*Deg2Rad;
			eccentricity = Ecc[calendar][planet];
			if (calendar == 0) eccentricity = eccentricity +Ecc1S[6]* Math.abs(Math.sin(argument));
			return  this.normalize(mean - Math.asin(eccentricity*Math.sin(argument))/Deg2Rad);
		}else if (planet == 0) {  //The Sun
			argument = (mean - Mandocca[calendar][planet])*Deg2Rad;
			eccentricity = Ecc[calendar][0];
			if (calendar == 0) eccentricity = eccentricity + Ecc1S[0]*Math.abs(Math.sin(argument));
			sunMeanLong = this.normalize(mean - Math.asin(eccentricity*Math.sin(argument))/Deg2Rad);
			return sunMeanLong; 
		} else if (planet == 1 || planet == 2) { //Inner planet
			if (calendar < 2) {
				sunMeanLong = Utils.meanLong(0, calendar, d, hasBija);
				argument = (mean - sunMeanLong)*Deg2Rad;
				rhoB = Rho[calendar][planet];
				if (calendar == 0) rhoB = rhoB + Rho1S[planet]*Math.abs(Math.sin(argument));
				nu1 = Mandocca[calendar][planet] -0.5*Math.atan(rhoB*Math.sin(argument)/
						(1+rhoB*Math.cos(argument)))/Deg2Rad;
				argument = (sunMeanLong - nu1)*Deg2Rad;
				eccentricity = Ecc[calendar][planet];
				if (calendar == 0) eccentricity = eccentricity + Ecc1S[planet]*Math.abs(Math.sin(argument));
				nu2 = eccentricity * Math.sin(argument);
				nu2 = nu1 + 0.5 *Math.asin(nu2)/Deg2Rad;
				argument = (sunMeanLong-nu2)*Deg2Rad;
				eccentricity = Ecc[calendar][planet];
				if (calendar == 0) eccentricity = eccentricity + Ecc1S[planet]*Math.abs(Math.sin(argument));
				nu3 = eccentricity * Math.sin(argument);
				nu3 = sunMeanLong - Math.asin(nu3)/Deg2Rad;
				nu3 = this.normalize(nu3);
				argument = (mean-nu3)*Deg2Rad;
				rhoB = Rho[calendar][planet];
				if (calendar == 0) rhoB = rhoB + Rho1S[planet]*Math.abs(Math.sin(argument));
				temp = nu3 + Math.atan(rhoB*Math.sin(argument)/(1 + rhoB*Math.cos(argument)))/Deg2Rad;
				return this.normalize(temp);
			} else {
				sunMeanLong = Utils.meanLong(0, calendar, d, hasBija);
				argument = (mean - sunMeanLong)*Deg2Rad;
				eccentricity = Ecc[calendar][planet] + Ecc1[planet]*Math.abs(Math.sin(argument));
				rhoB = Rho[calendar][planet]+Rho1[planet]*Math.abs(Math.sin(argument));
				var beta = sunMeanLong + 0.5*Math.atan(rhoB*Math.sin(argument)/
								(1 + rhoB * Math.cos(argument)))/Deg2Rad;
				argument = (beta - Mandocca[calendar][planet])*Deg2Rad;
				eccentricity = Ecc[calendar][planet] + Ecc1[planet]*Math.abs(Math.sin(argument));
				var gamma = eccentricity* Math.sin(argument);
				gamma = sunMeanLong - Math.asin(gamma)/Deg2Rad;
				argument = (mean-gamma)*Deg2Rad;
				rhoB = Rho[calendar][planet]+Rho1[planet]*Math.abs(Math.sin(argument));
				temp = gamma + Math.atan(rhoB*Math.sin(argument)/
							(1 + rhoB * Math.cos(argument)))/Deg2Rad;
				return this.normalize(temp);
			}
		} else { //Outer planet
			if (calendar < 2) {
				sunMeanLong = Utils.meanLong(0, calendar, d, hasBija);
				argument = (sunMeanLong-mean)*Deg2Rad;
				rhoB = Rho[calendar][planet];
				if (calendar == 0) rhoB = rhoB + Rho1S[planet]*Math.abs(Math.sin(argument));
				nu1 = Mandocca[calendar][planet] -0.5*Math.atan(rhoB*Math.sin(argument)/
						(1+rhoB*Math.cos(argument)))/Deg2Rad;
				argument = (mean - nu1)*Deg2Rad;
				eccentricity = Ecc[calendar][planet];
				if (calendar == 0) eccentricity = eccentricity + Ecc1S[planet]*Math.abs(Math.sin(argument));
				nu2 = eccentricity * Math.sin(argument);
				nu2 = nu1 + 0.5 *Math.asin(nu2)/Deg2Rad;
				argument = (mean -nu2)*Deg2Rad;
				eccentricity = Ecc[calendar][planet];
				if (calendar == 0) eccentricity = eccentricity + Ecc1S[planet]*Math.abs(Math.sin(argument));
				nu3 = eccentricity * Math.sin(argument);
				nu3 = mean - Math.asin(nu3)/Deg2Rad;
				nu3 = this.normalize(nu3);
				argument = (sunMeanLong-nu3)*Deg2Rad;
				rhoB = Rho[calendar][planet];
				if (calendar == 0) rhoB = rhoB + Rho1S[planet]*Math.abs(Math.sin(argument));
				temp = nu3 + Math.atan(rhoB*Math.sin(argument)/(1 + rhoB*Math.cos(argument)))/Deg2Rad;
				return this.normalize(temp);
			} else {
				sunMeanLong = Utils.meanLong(0, calendar, d, hasBija);
				argument = (mean - Mandocca[calendar][planet])*Deg2Rad;
				eccentricity = Ecc[calendar][planet] + Ecc1[planet]*Math.abs(Math.sin(argument));
				var alpha = mean - 0.5*Math.asin(eccentricity*Math.sin(argument))/Deg2Rad;
				argument = (sunMeanLong - alpha)*Deg2Rad;
				rhoB = Rho[calendar][planet]+Rho1[planet]*Math.abs(Math.sin(argument));
				var beta = alpha + 0.5*Math.atan(rhoB*Math.sin(argument)/
								(1 + rhoB * Math.cos(argument)))/Deg2Rad;
				argument = (beta - Mandocca[calendar][planet])*Deg2Rad;
				eccentricity = Ecc[calendar][planet] + Ecc1[planet]*Math.abs(Math.sin(argument));
				var gamma = eccentricity* Math.sin(argument);
				gamma = mean - Math.asin(gamma)/Deg2Rad;
				argument = (sunMeanLong-gamma)*Deg2Rad;
				rhoB = Rho[calendar][planet]+Rho1[planet]*Math.abs(Math.sin(argument));
				temp = gamma + Math.atan(rhoB*Math.sin(argument)/
							(1 + rhoB * Math.cos(argument)))/Deg2Rad;
				return Utils.normalize(temp);
			}
		}
	}

    static normalize(x) {
		while (x < 0) x = x + 360;
		while (x >= 360) x = x - 360;
		return x;
	}

    static sdm(x) {
		var sig;
        var deg;
        var min;

		x = x + 0.5/60;
		if (x > 360) x = x - 360;
		sig = parseInt(x/30);
		x = x - sig*30;
		deg = parseInt(x);
		min = parseInt((x - deg)*60);

		var str = sprintf("%1$2d:", sig);
		if (deg < 10) str = str + "0" + sprintf("%1$1d:",deg);
		else str = str + sprintf("%1$2d:",deg);
		if (min < 10) str = str + "0" + sprintf("%1$1d",min);
		else str = str + sprintf("%1$2d",min);
		return str;
		 
	}
}


export default Utils;