//determining historical era from date of birth
export const getHistoricalEra = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    
    const year = new Date(dateOfBirth).getFullYear();
    
    if (year < 500) return 'Ancient Era';
    if (year < 1000) return 'Early Medieval Period';
    if (year < 1300) return 'High Medieval Period';
    if (year < 1500) return 'Late Medieval Period';
    if (year < 1600) return 'Renaissance';
    if (year < 1700) return 'Early Modern Period';
    if (year < 1800) return 'Age of Enlightenment';
    if (year < 1900) return 'Victorian Era';
    if (year < 1920) return 'Edwardian Era';
    if (year < 1940) return 'Interwar Period';
    if (year < 1960) return 'Post-War Era';
    if (year < 1980) return 'Modern Era (1960s-1970s)';
    if (year < 2000) return 'Late 20th Century';
    if (year < 2010) return 'Early 2000s';
    return 'Contemporary Era';
};

//formating time period context for display
export const getTimePeriodContext = (dateOfBirth, placeOfBirth) => {
    if (!dateOfBirth && !placeOfBirth) return null;
    
    let context = '';
    
    if (dateOfBirth) {
        const year = new Date(dateOfBirth).getFullYear();
        const era = getHistoricalEra(dateOfBirth);
        context = `${year} (${era})`;
    }
    
    if (placeOfBirth) {
        if (context) {
            context += ` in ${placeOfBirth}`;
        } else {
            context = placeOfBirth;
        }
    }
    
    return context;
};

//calculating character's age from date of birth
export const calculateAge = (dateOfBirth, currentYear = null) => {
    if (!dateOfBirth) return null;
    
    const birthDate = new Date(dateOfBirth);
    const current = currentYear ? new Date(currentYear, 0, 1) : new Date();
    
    let age = current.getFullYear() - birthDate.getFullYear();
    const monthDiff = current.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && current.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

//calculating years since embrace
export const calculateYearsSinceEmbrace = (embraceDate, currentYear = null) => {
    if (!embraceDate) return null;
    
    const embrace = new Date(embraceDate);
    const current = currentYear ? new Date(currentYear, 0, 1) : new Date();
    
    let years = current.getFullYear() - embrace.getFullYear();
    const monthDiff = current.getMonth() - embrace.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && current.getDate() < embrace.getDate())) {
        years--;
    }
    
    return years;
};