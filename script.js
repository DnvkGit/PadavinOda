
        // Kannada transliterator using provided rules
        class KannadaTransliterator {
            constructor() {
                this.vowels = {
                    'a': 'ಅ', 'aa': 'ಆ', 'A': 'ಆ', 'i': 'ಇ', 'ee': 'ೀ', 'I': 'ೀ',
                    'u': 'ಉ', 'U': 'ಊ', 'Ri': 'ಋ', 'RI': 'ೠ', 'e': 'ಎ', 'E': 'ಏ',
                    'ai': 'ಐ', 'o': 'ಒ', 'O': 'ಓ', 'au': 'ಔ', 'M': 'ಂ', 'aM': 'ಅಂ'
                };

                this.vowelSigns = {
                    'a': '', 'aa': 'ಾ', 'A': 'ಾ', 'i': 'ಿ', 'ee': 'ೀ', 'I': 'ೀ',
                    'u': 'ು', 'oo': 'ೂ', 'U': 'ೂ', 'e': 'ೆ', 'E': 'ೇ', 'ai': 'ೈ',
                    'o': 'ೊ', 'O': 'ೋ', 'au': 'ೌ', 'ou': 'ೌ', 'aM': 'ಂ', 'M': 'ಂ', 'AM': '್ಂ',
                    '-': '್', '~': 'ఁ',
                    'Ri': 'ೃ', 'RI': 'ౄ', ':': 'ಃ'
                };

                this.consonants = {
                    'k': 'ಕ', 'kh': 'ಖ', 'K': 'ಖ', 'g': 'ಗ', 'gh': 'ಘ', 'G': 'ಘ', 'NG': 'ಙ',
                    'c': 'ಚ', 'ch': 'ಚ', 'chh': 'ಛ', 'C': 'ಛ', 'j': 'ಜ', 'jh': 'ಝ', 'J': 'ಝ', 'NY': 'ಞ',
                    'T': 'ಟ', 'Th': 'ಠ', 'D': 'ಡ', 'Dh': 'ಢ', 'N': 'ಣ',
                    't': 'ತ', 'th': 'ಥ', 'd': 'ದ', 'dh': 'ಧ', 'n': 'ನ',
                    'p': 'ಪ', 'ph': 'ಫ', 'f': 'ಫ', 'b': 'ಬ', 'bh': 'ಭ', 'B': 'ಭ', 'm': 'ಮ',
                    'y': 'ಯ', 'r': 'ರ', 'Rh': 'ಱ', 'l': 'ಲ', 'L': 'ಳ', 'v': 'ವ', 'w': 'ವ', 'S': 'ಶ', 's': 'ಸ',
                    'sh': 'ಷ', 'Sh': 'ಷ', 'h': 'ಹ', 'kSh': 'ಕ್ಷ', 'x': 'ಕ್ಷ'
                };

                this.nconjoins = {
                    'nk': 'ಂ', 'nkh': 'ಂ', 'ng': 'ಂ', 'ngh': 'ಂ', 'nc': 'ಂ', 'nch': 'ಂ',
                    'nj': 'ಂ', 'njh': 'ಂ', 'nT': 'ಂ', 'nTh': 'ಂ', 'nD': 'ಂ', 'nDh': 'ಂ',
                    'nt': 'ಂ', 'nth': 'ಂ', 'nd': 'ಂ', 'ndh': 'ಂ', 'nl': 'ಂ', 'ns': 'ಂ',
                    'nS': 'ಂ', 'nSh': 'ಂ', 'naM': 'ಂ'
                };

                this.virama = '್';
                this.hyphen = '್ ';
                this.visarga = 'ಃ';
                this.anusvar = 'ಂ';
            }

            transliterate(inputText) {
                if (!inputText) return '';
                
                let output = '';
                let i = 0;
                const n = inputText.length;

                while (i < n) {
                    // Check for vowel digraphs (e.g., 'aa', 'ii')
                    let matched = false;
                    for (let vLen = 2; vLen >= 1; vLen--) {
                        if (i + vLen <= n && this.vowels[inputText.substr(i, vLen)]) {
                            output += this.vowels[inputText.substr(i, vLen)];
                            i += vLen;
                            matched = true;
                            break;
                        }
                    }
                    
                    if (!matched) {
                        // Check for consonant + vowel combos
                        for (let cLen = 3; cLen >= 1; cLen--) {
                            if (i + cLen <= n && this.consonants[inputText.substr(i, cLen)]) {
                                const cons = inputText.substr(i, cLen);
                                i += cLen;
                                let vowel = '';
                                
                                // Look ahead for vowel
                                for (let vLen = 2; vLen >= 1; vLen--) {
                                    if (i + vLen <= n && this.vowelSigns[inputText.substr(i, vLen)] !== undefined) {
                                        vowel = inputText.substr(i, vLen);
                                        i += vLen;
                                        break;
                                    }
                                }

                                // Handle special case for M
                                if (cons === 'M' && vowel === '') {
                                    output += this.virama;
                                    matched = true;
                                    break;
                                }

                                // Check for njoins as anusvara
                                if (cons === 'n' && vowel === '') {
                                    const nJoinCheck = inputText.substr(i - cLen, cLen + 1);
                                    if (this.nconjoins[nJoinCheck]) {
                                        output += this.anusvar;
                                    } else {
                                        output += this.consonants[cons] + this.virama;
                                    }
                                } else {
                                    output += this.consonants[cons];
                                    if (vowel === '') {
                                        output += this.virama;
                                    } else {
                                        output += this.vowelSigns[vowel] || '';
                                    }
                                }
                                matched = true;
                                break;
                            }
                        }
                    }
                    
                    if (!matched) {
                        // If nothing matched, add as is
                        output += inputText[i];
                        i++;
                    }
                }
                
                return output;
            }

            splitIntoSyllables(kannadaText) {
                const syllables = [];
                let currentSyllable = '';
                
                for (let i = 0; i < kannadaText.length; i++) {
                    const char = kannadaText[i];
                    const charCode = char.charCodeAt(0);
                    
                    // Check if current character is a consonant
                    const isConsonant = (charCode >= 0x0C95 && charCode <= 0x0CB9);
                    // Check if current character is a vowel
                    const isVowel = (charCode >= 0x0C85 && charCode <= 0x0C94);
                    // Check if current character is a vowel sign
                    const isVowelSign = (charCode >= 0x0CBE && charCode <= 0x0CCC);
                    // Check for special characters
                    const isVirama = (char === '್');
                    const isAnusvara = (char === 'ಂ');
                    const isVisarga = (char === 'ಃ');
                    
                    if (isVowel) {
                        // Standalone vowel starts new syllable
                        if (currentSyllable) {
                            syllables.push(currentSyllable);
                        }
                        currentSyllable = char;
                    } else if (isConsonant) {
                        // Consonant: check if we need to end previous syllable
                        if (currentSyllable && !currentSyllable.endsWith('್')) {
                            syllables.push(currentSyllable);
                            currentSyllable = '';
                        }
                        currentSyllable += char;
                    } else if (isVirama) {
                        // Virama indicates conjunct - add to current syllable
                        currentSyllable += char;
                        // Look ahead to see if next char is a consonant
                        if (i + 1 < kannadaText.length) {
                            const nextChar = kannadaText[i + 1];
                            const nextCharCode = nextChar.charCodeAt(0);
                            // If next is not a consonant, this virama ends the syllable
                            if (!(nextCharCode >= 0x0C95 && nextCharCode <= 0x0CB9)) {
                                // This virama is at end of syllable (halant)
                                // Keep it as part of current syllable
                            }
                        }
                    } else if (isVowelSign || isAnusvara || isVisarga) {
                        // Vowel modifiers - add to current syllable
                        currentSyllable += char;
                    } else {
                        // Other characters
                        if (currentSyllable) {
                            syllables.push(currentSyllable);
                            currentSyllable = '';
                        }
                        if (char.trim()) {
                            syllables.push(char);
                        }
                    }
                }
                
                if (currentSyllable) {
                    syllables.push(currentSyllable);
                }
                
                // Ensure we have exactly 4 syllables for the game
                while (syllables.length < 4) {
                    syllables.push('');
                }
                
                return syllables.slice(0, 4);
            }
        }

        // Kannada word list - word:meaning format for easy addition
        const kannadaWordList = [
            'ಗರ್ಭಗುಡಿ:ಮೂಲ ವಿಗ್ರಹವನ್ನು ಇಟ್ಟಿರುವ ಒಳಭಾಗ',
              'ಗಮ್ಯಸ್ಥಾನ:ಸೇರಬೇಕಾದ ಜಾಗ', 'ಗತ್ಯಂತರ:ಅನ್ಯಮಾರ್ಗ', 'ಚಂದ್ರಚೂಡ:ಶಿವ', 'ಗಡಿಬಿಡಿ:1 ಅವಸರ 2 ಗೊಂದಲ', 'ಚಕ್ರವಾಕ:ಕಲ್ಪನೆಯ ಜೋಡಿಹಕ್ಕಿ',
              'ಆಜ್ಞಾಪನ:ಅಪ್ಪಣೆ ಕೊಡುವುದು', 'ಚಂದ್ರಮೌಳಿ:ಶಿವ', 'ಅಕ್ಷರಶಃ:ಇದ್ದದ್ದು ಇದ್ದಹಾಗೆ, ಶಬ್ದಶಃ', 'ಚಕ್ರವರ್ತಿ:ಸಾಮ್ರಾಟ', 'ಕಕ್ಕಾಬಿಕ್ಕಿ:ದಿಕ್ಕು ತಪ್ಪಿ ಓಡು',
              'ಗಜಿಬಿಜಿ:ಅಸ್ತವ್ಯಸ್ತ', 'ಗಮನಿಸು:ಲಕ್ಷ್ಯಕೊಡು', 'ಗಡಿರೇಖೆ:ಸರಹದ್ದು ಗೆರೆ', 'ಗವಸಣಿ:ಮುಚ್ಚಿಗೆ', 'ಅಗಲಿಸು:ಬೇರ್ಪಡಿಸು', 'ಚಂಚಲಿತ:ಅಸ್ಥಿರತೆ',
              'ಗತಿಶೂನ್ಯ:ಗತಿವಿಹೀನ', 'ಪರಿಮಳ:ಸುವಾಸನೆ', 'ಗಮನಾರ್ಹ:ಗಮನಿಸಬೇಕಾದ', 'ಘಟಸರ್ಪ:ಅಜಗರ', 'ಗಜಸ್ನಾನ:ಆನೆಯ ಜಳಕ, ಅಪ್ರಯೊಜಕ ಕೆಲಸ',
              'ಖಂಡಕಾವ್ಯ:ಚಿಕ್ಕಕಾವ್ಯ', 'ಗತಿಗೇಡು:ಗತಿ ತಪ್ಪಿದವ', 'ಅಗಣಿತ:ಎಣಿಕೆಗೆ ಮೀರಿದ', 'ಆಡಂಬರ:ತೋರಿಕೆ', 'ಚಂದ್ರಹಾರ:ಕಂಠಾಭರಣ', 'ಗತ್ತುಗಾರ:ಅಹಂಕಾರಿ',
              'ಚಕಮಕಿ:ಬೆಂಕಿಹೊತ್ತಿಸುವ ಕಲ್ಲು', 'ಗಣಿತಜ್ಞ: ಗಣಿತ ಬಲ್ಲವ', 'ಖಂಡರಿಸು:ತುಂಡು ಮಾಡು', 'ಗಡಿಗಟ್ಟು:ಸೀಮೆ ನಿರ್ಣಯಿಸು', 'ಚಂದ್ರಗತಿ:ಚಂದ್ರನ ಚಲನೆ',
              'ಆತ್ಮಕಥೆ:ತನ್ನ ಚರಿತ್ರೆ', 'ಗಡಿಯಾರ:ಕಾಲ ಸೂಚಿ', 'ಖಂಡನೀಯ:ನಿರಾಕರಿಸಲು ಯೋಗ್ಯವಾದ', 'ಗಣಾಧೀಶ:ಗಣೇಶ', 'ಗಜರಿಪು:ಸಿಂಹ, ಆನೆಯ ಶತ್ರು',
              'ಲಕ್ಷ್ಯಕೊಡು:ಗಮನಿಸು', 'ಗತಪ್ರಜ್ಞ:ಪ್ರಜ್ಞೆಯನ್ನು ಕಳೆದುಕೊಂಡವನು.', 'ಆಗಂತುಕ:ಅಪರಿಚಿತ', 'ಗಲ್ಲುಗಂಬ:ನೇಣು ಕಂಬ', 'ಚಂದ್ರಯಾನ:ಚಂದ್ರ ಪ್ರಯಾಣ',
              'ಗಲ್ಲುಗಾರ:ಗಲ್ಲಿಗೇರಿಸುವವನು', 'ಆಗಮನ:ಬರುವದು', 'ಚಕ್ರವಾತ:ಸುಂಟರಗಾಳಿ', 'ಚಂಡಕರ:ಸೂರ್ಯ', 'ಖಂಡತುಂಡು:ಕತ್ತರಿಸಿದ ಚೂರು', 'ಗರಧರ:ಶಿವ',
              'ಗತವರ್ಷ:ಹಿಂದಿನ ಸಂವತ್ಸರ', 'ಅಂಕುರಿತ:ಮೊಳೆಯುವಿಕೆ', 'ಜಗನ್ಮಾತೆ:ಲೋಕಮಾತೆ', 'ಜಜ್ಜರಿತ:ಶಿಥಿಲವಾದ', 'ಜಠರಾಗ್ನಿ:ಜೀರ್ಣಮಾಡುವ ಅಗ್ನಿ',
              'ಝಟಪಟ:ಬೇಗಬೇಗನೆ', 'ಟಂಕಶಾಲೆ:ನಾಣ್ಯ ತಯಾರಿಸುವ ಜಾಗ', 'ಟಿಪ್ಪಣಿಸು:ವ್ಯಾಖ್ಯಾನಿಸು', 'ಠಕ್ಕುಗಾರ:ಮೋಸಮಾಡುವವ', 'ಠೇಂಕರಿಸು:ಬಿಲ್ಲಿನ  ಶಬ್ದ', 
              'ಡಂಗುರಿಸು:ಭೇರಿ ನಾದ/ಪ್ರಕಟಿಸು', 'ಡೋಲೋತ್ಸವ:ದೇವರನ್ನು ತೂಗುವ ಉತ್ಸವ', 'ತಂಗಳನ್ನ:ಹಿಂದಿನ ದಿನದ ಅನ್ನ', 'ತಂಟೆಕೋರ:ಜಗಳಗಂಟ',
              'ತಕರಾರು:ಆಕ್ಷೇಪಣೆ/ ದೂರು', 'ದಂಗುಬಡಿ:ಆಶ್ಚರ್ಯಪಡು', 'ದಂಭಾಚಾರ:ಬೂಟಾಟಿಕೆಯ ನಡವಳಿಕೆ', 'ದಗಾಕೋರ:ಮೋಸಗಾರ',
              'ದನಗಾಹಿ:ಗೋಪಾಲಕ', 'ದಬಾವಣೆ:ಒತ್ತಡ ಹೇರು', 'ದಯನೀಯ:ಕರುಣಾಜನಕ ಸ್ಥಿತಿ', 'ದರಸ್ಮಿತ:ಮಂದಹಾಸ', 'ಪಾಲುಗಾರ:ಭಾಗಸ್ಥ',
              'ಪರಿವ್ರಾಜ:ಸನ್ಯಾಸಿ', 'ಪುನರಪಿ:ಮತ್ತೊಂದು ಸಲ/ ಬಾರಿ', 'ಪಾರದರ್ಶಿ:ವಿದ್ವಾಂಸ/  ಬೆಳಕನ್ನು ಸಾಗಿಸುವ', 'ಪರಿಮಳ:ಸುವಾಸನೆ',
              'ಪಂಚತತ್ವ:ಐದು ಮೂಲವಸ್ತುಗಳು(ಭೂಮಿ,ಜಲ…)', 'ಜಂಬಕೊಚ್ಚು:ಆತ್ಮಸ್ತುತಿ ಮಾಡಿಕೊಳ್ಳು', 'ಪುರಸ್ಕಾರ:ಸನ್ಮಾನ/ ಗೌರವ',
              'ಪರಿಶೋಧ:ಸಂಶೋಧನೆ / ಕಂಡು ಹಿಡಿಯುವಿಕೆ', 'ಪರಿಚಯ:ತಿಳಿಸಿ ಕೊಡುವಿಕೆ', 'ಪೂಜ್ಯಭಾವ:ಗೌರವಭಾವ/ ಪೂಜ್ಯತೆ', 'ಪುರಾವೃತ್ತ:ಪುರಾತನ ಸಂಪ್ರದಾಯ',
              'ನಕ್ಷತ್ರಕ:ಉಪದ್ರವ ಕೊಡುವ ವ್ಯಕ್ತಿ', 'ಗಡಿಬಿಡಿ:1 ಅವಸರ 2 ಗೊಂದಲ', 'ಪಾತ್ರಧಾರಿ:ಅಭಿನಯಿಸುವ ವ್ಯಕ್ತಿ',
              'ಪುರುಷಾರ್ಥ:ನಾಲ್ಕು ಪರಮಧ್ಯೇಯಗಳು(ಧರ್ಮ….)', 'ಪರಿಶುದ್ಧ:ಪವಿತ್ರ/ ನಿರ್ಮಲ ವಾದ ', 'ಲಕ್ಷ್ಯಕೊಡು:ಗಮನಿಸು', 'ಧಾರಾಪಾತ್ರೆ:ಜಲಾಭಿಷೇಕದ ಪಾತ್ರೆ',
              'ನಗಧರ:ಗಿರಿಧಾರಿ', 'ಜಗಜಟ್ಟಿ:ಪ್ರಸಿದ್ಧನಾದ ಮಲ್ಲ', 'ಆಡಂಬರ:ತೋರಿಕೆ', 'ಪಟ್ಟಶಿಷ್ಯ:ಪ್ರಿಯ/ಮುಖ್ಯ ವಿದ್ಯಾರ್ಥಿ',
              'ಪುರಸತ್ತು:ವಿರಾಮ/ ಬಿಡುವು;', 'ಆಡಳಿತ:ಆಳಿಕೆ', 'ನಖಾಯುಧ:ಉಗುರಿನ ಆಯುಧ', 'ಗವಸಣಿ:ಮುಚ್ಚಿಗೆ',
              'ಚಕ್ರವರ್ತಿ:ಸಾಮ್ರಾಟ', 'ಧಡಾರನೆ:ಜೋರಾಗಿ/  ಶಬ್ದಯುತ', 'ಧರ್ಮಶೀಲ:ಧರ್ಮಪಾಲಿಸುವವ', 'ನಟರಾಜ:ನಾಟ್ಯದ ಅಧಿದೇವತೆ',
              'ಪುಷ್ಕರಿಣಿ:ದೇವಾಲಯದ ಸರೋವರ', 'ಧನ್ಯವಾದ:ಉಪಕಾರ ಸ್ಮರಣೆ', 'ಘಟಸರ್ಪ:ಅಜಗರ', 'ನಮಸ್ಕಾರ:ಕೈಜೋಡಿಸು', 'ಪರಿಕ್ರಮ:ಸುತ್ತುವುದು',
              'ಪುಲಕಿತ:ರೋಮಾಂಚನ ಹೊಂದಿದ', 'ಪುರಜನ:ನಾಗರೀಕರು', 'ಪಾರಿತೋಷ:ಬಹುಮಾನ', 'ಧಾರಾಕಾರ:ಸತತವಾಗಿ',
              'ಧನಮದ:ಶ್ರೀಮಂತಿಕೆಯ ಗರ್ವ', 'ಪರಿಪೂರ್ಣ:ಪೂರ್ತಿಯಾದ/ ಸಮಗ್ರ', 'ಪುರಾಕೃತ:ಹಿಂದೆ ಮಾಡಿದ', 'ಪಟ್ಟುಹಿಡಿ:ದೃಢ/ಹಟ ಹಿಡಿದು ಮಾಡುವ ಯತ್ನ',
              'ನಂದಾದೀಪ:ಸದಾ ಉರಿಯುತ್ತಿರುವ ದೀಪ', 'ಪಂಕ್ತಿಭೇದ:ಪಕ್ಷಪಾತ ಮಾಡುವುದು', 'ಪಾರಿಜಾತ:ದೇವವೃಕ್ಷದ ಪೂಜದ ಹುವ್ವು', 'ಪೂರ್ಣಪ್ರಜ್ಞ:ಸಂಪೂರ್ಣ ಪಾಂಡಿತ್ಯ',
              'ಪಂಚಗವ್ಯ:ಹಸುವಿನ ಐದು ವಸ್ತುಗಳ ಮಿಶ್ರಣ', 'ಪಾದತ್ರಾಣ:ಪಾದರಕ್ಷೆ', 'ನಡವಳಿ:ವರ್ತನೆ', 'ಪಾಪಭೀತಿ:ದುರಾಚಾರದ ಭಯ',
              'ಪಂಚಭೂತ:ಐದು ಮೂಲವಸ್ತುಗಳು(ಭೂಮಿ,ಜಲ…)', 'ನೆಂಟಸ್ತಿಕೆ:ಬಾಂಧವ್ಯ', 'ಪಡಸಾಲೆ:ನಡುಮನೆ/ ಜಗಲಿ', 'ಧಡಪಡ:ಬೇಗಬೇಗನೆ',
              'ಪಡಿನುಡಿ:ಪ್ರತ್ಯುತ್ತರ', 'ಪಂಚಲೋಹ:ಐದು ಲೋಹಗಳ ಮಿಶ್ರ', 'ಪೌರಾಣಿಕ:ಪುರಾಣಕ್ಕೆ ಸಂಬಂಧಿತ',  'ಪ್ರತಿದ್ವಂದ್ವಿ:ಎದುರಾಳು /ವಿರೋಧಿ',  'ಬದ್ಧವೈರಿ:ಪರಮ ಶತ್ರು',  
            'ಪ್ರಕಟಣೆ:ತಿಳಿಯ ಪಡಿಸುವುದು / ಮುದ್ರಿಸುವುದು',  'ಪ್ರತಿಕೂಲ:ವಿರುದ್ಧವಾದ / ಅನುಕೂಲವಲ್ಲದ',  'ಬಂಧುಜನ:ನೆಂಟರು',  'ಬೆದರಿಸು:ಭಯಪಡಿಸು',  
            'ಫಲಾಹಾರ:ಹಣ್ಣಿನ ಆಹಾರ/  ಉಪಾಹಾರ',  'ಬೃಂದಗಾನ:ಸಾಮೂಹಿಕವಾಗಿ ಹಾಡುವ ಹಾಡು',  'ಫಲಪ್ರದ:ಸಫಲವಾದುದು',  'ಪಿಳ್ಳಂಗೋವಿ:ಕೊಳಲು',  
            'ಪಿತೃಋಣ:ಪಿತೃದೆವತರಿಗೆ ಸಲ್ಲಿಸ ಬೇಕಾದ ಋಣ',  'ಬೇಟೆಗಾರ:ಶಿಕಾರಿ ಮಾಡುವವನು',  'ಪ್ರಣಾಳಿಕೆ:ಸಾರ್ವಜನಿಕ ಪ್ರಕಟಣೆ/ ಘೋಷಣೆ',  'ಬೃಹಸ್ಪತಿ:ದೇವಗುರು',  
            'ಪ್ರಕರಣ:ಘಟನೆ, ಗ್ರಂಥಭಾಗ',  'ಬಂಡೆಗಲ್ಲು:ಶಿಲಾಖಂಡ / ದೊಡ್ಡಕಲ್ಲು',  'ಬೂಟಾಟಿಕೆ:ಡಂಭ/ ಆಡಂಬರ',  'ಬೆಳೆಯಿಸು:ವೃದ್ಧಿ ಯಾಗುವಂತೆ ಮಾಡು',  
            'ಪ್ರತಿಧ್ವನಿ:ಮರುಧ್ವನಿ',  'ಬೆಂಬಲಿಸು:ಸಹಕರಿಸು/ ಸಮರ್ಥಿಸು',  'ಪುಂಡರೀಕ:ಬಿಳಿಯ ತಾವರೆ / ಬಿಳಿಯ ನಾಮ',  'ಬಂಡವಾಳ:ಅಸಲು / ಮೂಲಧನ',  
            'ಬುದ್ಧಿಶಾಲಿ:ಜ್ಞಾನವುಳ್ಳ / ಚುರುಕುಬುದ್ಧಿ',  'ಪ್ರಜಾಹಿತ:ಜನರಿಗೆ ಪ್ರಯೋಜಕವಾದ',  'ಬೀಗತನ:ಮದುವೆಯಿಂದಾಗುವ ಬಂಧುತ್ವ',  'ಬಡಬಾಗ್ನಿ:ಸಮುದ್ರದೊಳಗಿನ ಬೆಂಕಿ',  
            'ಫಲವತ್ತು:ಸಾರವತ್ತಾದುದು', 'ಭೌಗೋಳಿಕ:ಭೂಗೋಳಕ್ಕೆ ಸಂಬಂಧಿಸಿದ',  'ಪ್ರಕೀರ್ತಿತ:ಹೆಸರಾದ / ಘೋಷಿಸಲಾದ',  'ಬೇಸರಿಕೆ:ನಿರುತ್ಸಾಹ / ಆಸಕ್ತಿಯಿಲ್ಲದಿರುವಿಕೆ',  
            'ಬಿಡುಗಡೆ:ಬಂಧನದಿಂದ ವಿಮೋಚನೆ',  'ಬಡಾವಣೆ:(ನಗರ) ವಿಸ್ತರಿಸುವಿಕೆ',  'ಬಿತ್ತರಿಸು:ವಿಸ್ತರಿಸು / ಬೀಜಹಾಕುವಿಕೆ',  'ಪಾರಂಗತ:ಚೆನ್ನಾಗಿ ತಿಳಿದವನು / ನಿಷ್ಣಾತ',  
            'ಪೀತಾಂಬರ:ಹಳದಿ ಬಣ್ಣದ ರೇಷ್ಮೆಬಟ್ಟೆ',  'ಬಿಗಿಹಿಡಿ:ಗಟ್ಟಿಯಾಗಿ ಹಿಡಿದುಕೊಳ್ಳು',  'ಪರಸ್ಪರ:ಒಬ್ಬರಿಗೊಬ್ಬರು ಸಂಬಂಧಿಕರು'
        ];

        // Game state
        let transliterator = new KannadaTransliterator();
        let currentWord = null;
        let guesses = [];
        let gameStatus = 'playing';
        let selectedDate = new Date();
        let hintsUsed = 0;
        let easterEggTimer = null;

        // DOM elements
        const englishInput = document.getElementById('englishInput');
        const kannadaPreview = document.getElementById('kannadaPreview');
        const submitBtn = document.getElementById('submitBtn');
        const gameGrid = document.getElementById('gameGrid');
        const gameStatusDiv = document.getElementById('gameStatus');
        const helpBtn = document.getElementById('helpBtn');
        const helpModal = document.getElementById('helpModal');
        const historyBtn = document.getElementById('historyBtn');
        const hintBtn = document.getElementById('hintBtn');
        const newGameBtn = document.getElementById('newGameBtn');
        const easterEggDiv = document.getElementById('easterEgg');

        // Initialize game grid
        function initializeGrid() {
            gameGrid.innerHTML = '';
            for (let i = 0; i < 40; i++) {
                const tile = document.createElement('div');
                tile.className = 'game-tile font-kannada';
                gameGrid.appendChild(tile);
            }
        }

        // STRDT mechanism like Telugu Wordle - change this to pick specific words
        const STRDT = 46177; // Start date reference - change this to select different words
        
        // Get word of the day using STRDT mechanism like Telugu Wordle
        function getWordOfDay() {
            // Calculate days since reference date (like Excel date system)
			selectedDate.setHours(0,0,0,0)
			
			//const refDate = new Date('1900-01-01T00:00:00')
			//const daysSinceRef = Math.floor((SelectedDate - refDate)/(1000*60*60*24))			
            const refDate = new Date(1899, 11, 30); // December 30, 1899
			refDate.setHours(0,0,0,0)
            const daysSinceRef = Math.floor((selectedDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
            const wordIndex = ((daysSinceRef - STRDT) % kannadaWordList.length + kannadaWordList.length) % kannadaWordList.length;
            
            // Parse word:meaning format
            const wordEntry = kannadaWordList[wordIndex];
            const [word, meaning] = wordEntry.split(':');
            
            // Generate syllables dynamically
            const syllables = transliterator.splitIntoSyllables(word);
            
            console.log(`STRDT: ${STRDT}, Days since ref: ${daysSinceRef}, Word index: ${wordIndex}, Word: ${word}`);
            
            return {
                word: word,
                meaning: meaning,
                syllables: syllables
            };
        }

        // Update preview
        function updatePreview() {
            const englishText = englishInput.value;
            const kannadaText = transliterator.transliterate(englishText);
            
            if (kannadaText) {
                kannadaPreview.textContent = kannadaText;
                submitBtn.disabled = false;
            } else {
                kannadaPreview.innerHTML = '<span style="color: hsl(215 13% 44%);">Kannada preview...</span>';
                submitBtn.disabled = true;
            }
        }

        // Extract main consonant from syllable considering Kannada 'r' conjunct rules
        function getMainConsonant(syllable) {
            if (!syllable) return '';
            
            // Special rule for Kannada: ONLY when 'r' appears in conjunct (ರ್ + consonant), 
            // the second consonant is treated as main consonant for color analysis
            // This applies to patterns like ಗರ್ಭ, ಪರ್ವತ, ಕಾರ್ಯ
            // But NOT to standalone ರ like in ಪ್ರಪಂಚ, ವಿಪ್ರ where ರ is not followed by ್
            
            // Check specifically for 'ರ್' (r with halant) followed by another consonant
            const rConjunctPattern = /ರ್([ಕ-ಹ])/;
            const match = syllable.match(rConjunctPattern);
            
            if (match && match[1]) {
                console.log('*** R-CONJUNCT RULE APPLIED ***');
                console.log('Found r-conjunct (ರ್+consonant) in:', syllable, '-> treating main consonant as:', match[1], 'instead of ರ');
                console.log('Returning:', match[1], 'as main consonant');
                return match[1]; // Return the consonant after 'ರ್' as main
            }
            
            // For all other cases (including standalone ರ, or when ರ is second like in ವಿಪ್ರ), 
            // treat first consonant as main
            for (let i = 0; i < syllable.length; i++) {
                const char = syllable[i];
                const charCode = char.charCodeAt(0);
                if (charCode >= 0x0C95 && charCode <= 0x0CB9) { // Kannada consonants
                    console.log('Standard main consonant for', syllable, ':', char);
                    console.log('No r-conjunct found, using first consonant:', char);
                    return char;
                }
            }
            
            return '';
        }

        // Complete 6-color analysis from Telugu Wordle
        function analyzeGuess(guess, target, targetSyllables) {
            const guessSyllables = transliterator.splitIntoSyllables(guess);
            const colors = [];
            const targetFirstChars = targetSyllables.map(syl => syl ? syl.charCodeAt(0) : 0);
            
            console.log('Analyzing:', guessSyllables, 'vs', targetSyllables);
            
            for (let i = 0; i < 4; i++) {
                const guessSyll = guessSyllables[i] || '';
                const targetSyll = targetSyllables[i] || '';
                
                // 1. GREEN: Exact match
                if (guessSyll === targetSyll) {
                    colors.push('correct');
                    continue;
                }
                
                // 2. PINK/PURPLE/BROWN: Same position comparison using main consonant logic
                if (guessSyll && targetSyll) {
                    // Use main consonant extraction for proper comparison
                    const guessMainCons = getMainConsonant(guessSyll);
                    const targetMainCons = getMainConsonant(targetSyll);
                    
                    console.log(`Position ${i}: guess="${guessSyll}" (main: ${guessMainCons}) vs target="${targetSyll}" (main: ${targetMainCons})`);
                    
                    // Compare main consonants instead of first characters
                    if (guessMainCons && targetMainCons && guessMainCons === targetMainCons) {
                        console.log(`Same main consonants (${guessMainCons}) - checking for samyuktakshara differences`);
                        
                        // Check if it's a samyuktakshara (consonant + consonant)
                        const hasConsonantJoin = (syllable) => {
                            if (syllable.length < 2) return false;
                            for (let i = 1; i < syllable.length; i++) {
                                const charCode = syllable.charCodeAt(i);
                                // Check if it's a consonant (hallu) including same consonant repetition
                                if ((0x0C95 <= charCode && charCode <= 0x0CB9) || charCode === 0x0CCD) {
                                    return true;
                                }
                            }
                            return false;
                        };
                        
                        const guessHasConsonant = hasConsonantJoin(guessSyll);
                        const targetHasConsonant = hasConsonantJoin(targetSyll);
                        
                        // If both have consonant joins or same consonant repetition -> PURPLE (correct position, wrong samyuktakshara)
                        if (guessHasConsonant || targetHasConsonant) {
                            colors.push('correct-pos-wrong-samyuk'); // PURPLE
                        } else {
                            // Different gunintam (vowel signs only) -> PINK
                            colors.push('wrong-pos-gunintam'); // PINK
                        }
                        continue;
                    } else {
                        console.log(`Different main consonants (${guessMainCons} vs ${targetMainCons}) - proceeding to other color logic`);
                        // Skip fallback logic when main consonants are different - proceed to Brown/Light Blue analysis
                    }
                    
                    // Fallback: if first characters match AND main consonants were not properly identified
                    if ((!guessMainCons || !targetMainCons) && guessSyll.charCodeAt(0) === targetSyll.charCodeAt(0)) {
                        console.log(`FALLBACK: First characters match (${guessSyll[0]} vs ${targetSyll[0]}) - applying PINK/PURPLE logic`);
                        
                        const hasConsonantJoin = (syllable) => {
                            if (syllable.length < 2) return false;
                            for (let i = 1; i < syllable.length; i++) {
                                const charCode = syllable.charCodeAt(i);
                                if ((0x0C95 <= charCode && charCode <= 0x0CB9) || charCode === 0x0CCD) {
                                    return true;
                                }
                            }
                            return false;
                        };
                        
                        const guessHasConsonant = hasConsonantJoin(guessSyll);
                        const targetHasConsonant = hasConsonantJoin(targetSyll);
                        
                        if (guessHasConsonant || targetHasConsonant) {
                            colors.push('correct-pos-wrong-samyuk'); // PURPLE
                        } else {
                            colors.push('wrong-pos-gunintam'); // PINK
                        }
                        continue;
                    }
                }
                
                // 3. YELLOW: Wrong position but syllable exists
                if (guessSyll && targetSyllables.includes(guessSyll)) {
                    const targetCount = targetSyllables.filter(s => s === guessSyll).length;
                    const correctCount = guessSyllables.slice(0, 4).filter((s, idx) => 
                        s === targetSyllables[idx] && s === guessSyll).length;
                    const occurrenceCount = guessSyllables.slice(0, i + 1).filter(s => s === guessSyll).length;
                    
                    if (targetCount - correctCount - occurrenceCount + 1 >= 0) {
                        colors.push('wrong-syllable'); // YELLOW
                        continue;
                    }
                }
                
                // 4. LIGHT BLUE/BROWN: Wrong position, basic consonant match (with Kannada 'r' rule)
                if (guessSyll && guessSyll.length > 0) {
                    // Use main consonant logic that considers 'r' conjunct rules
                    const guessMainConsonant = getMainConsonant(guessSyll);
                    const guessMainCharCode = guessMainConsonant ? guessMainConsonant.charCodeAt(0) : guessSyll.charCodeAt(0);
                    
                    // Build target main consonants array
                    const targetMainChars = targetSyllables.map(syl => {
                        const mainCons = getMainConsonant(syl);
                        return mainCons ? mainCons.charCodeAt(0) : (syl ? syl.charCodeAt(0) : 0);
                    });
                    
                    const targetCharCount = targetMainChars.filter(c => c === guessMainCharCode).length;
                    
                    if (targetCharCount > 0) {
                        const correctCharCount = guessSyllables.slice(0, 4).filter((s, idx) => {
                            const mainCons = getMainConsonant(s);
                            const mainCharCode = mainCons ? mainCons.charCodeAt(0) : (s ? s.charCodeAt(0) : 0);
                            return mainCharCode === targetMainChars[idx] && mainCharCode === guessMainCharCode;
                        }).length;
                        
                        const charOccurrenceCount = guessSyllables.slice(0, i + 1).filter(s => {
                            const mainCons = getMainConsonant(s);
                            const mainCharCode = mainCons ? mainCons.charCodeAt(0) : (s ? s.charCodeAt(0) : 0);
                            return mainCharCode === guessMainCharCode;
                        }).length;
                        
                        if (targetCharCount - correctCharCount - charOccurrenceCount + 1 >= 0 && 
                            !targetSyllables.includes(guessSyll) && 
                            targetMainChars.includes(guessMainCharCode)) {
                            
                            const targetIndex = targetMainChars.indexOf(guessMainCharCode);
                            const targetMatch = targetSyllables[targetIndex];
                            
                            console.log('Consonant match - guess:', guessSyll, 'main:', guessMainConsonant, 'target:', targetMatch);
                            
                            if (targetMatch && targetMatch.length - guessSyll.length > 1) {
                                colors.push('wrong-samyuk'); // BROWN
                            } else {
                                colors.push('wrong-gunintam'); // LIGHT BLUE
                            }
                            continue;
                        }
                    }
                }
                
                // 5. GRAY: Not found
                colors.push('absent');
            }
            
            return colors;
        }

        // Update game grid
        function updateGrid() {
            const tiles = gameGrid.children;
            
            for (let i = 0; i < 40; i++) {
                const rowIndex = Math.floor(i / 4);
                const colIndex = i % 4;
                const guess = guesses[rowIndex];
                
                if (guess) {
                    tiles[i].textContent = guess.syllables[colIndex] || '';
                    tiles[i].className = `game-tile font-kannada tile-${guess.colors[colIndex] || 'absent'}`;
                } else {
                    tiles[i].textContent = '';
                    tiles[i].className = 'game-tile font-kannada';
                }
            }
        }

        // Update game status
        function updateGameStatus() {
            if (gameStatus === 'won') {
                const attempts = guesses.length;
                const hintText = hintsUsed > 0 ? ' (with hint)' : '';
                const celebrations = ['🎉', '✨', '🌟', '🎊', '💫'];
                const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];
                
                // Show auto-dismissing congratulation message
                showCongratulationMessage(`${randomCelebration} ಅದ್ಭುತ! You solved it in ${attempts} attempt${attempts > 1 ? 's' : ''}${hintText}! ${randomCelebration}`);
                
                gameStatusDiv.innerHTML = `
                    <div class="status-won">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">${randomCelebration}</div>
                        <div><strong>ಅಭಿನಂದನೆಗಳು! (Congratulations!)</strong></div>
                        <div style="margin-top: 0.5rem;">You solved it in ${attempts} attempt${attempts > 1 ? 's' : ''}${hintText}!</div>
                        <div style="margin-top: 0.5rem; font-size: 1rem; color: hsl(142 76% 70%);">
                            Word: <span class="font-kannada">${currentWord.word}</span> (${currentWord.meaning})
                        </div>
                    </div>
                `;
            } else if (gameStatus === 'lost') {
                // Show auto-dismissing game over message
                showGameOverMessage(`💔 Game Over! The word was: ${currentWord.word} (${currentWord.meaning})`);
                
                gameStatusDiv.innerHTML = '';
            } else {
                gameStatusDiv.innerHTML = '';
            }
        }

        // Show auto-dismissing congratulation message
        function showCongratulationMessage(message) {
            const congratsDiv = document.createElement('div');
            congratsDiv.className = 'congratulation-message';
            congratsDiv.innerHTML = message;
            document.body.appendChild(congratsDiv);
            
            // Auto-remove after animation
            setTimeout(() => {
                if (congratsDiv.parentNode) {
                    congratsDiv.parentNode.removeChild(congratsDiv);
                }
            }, 5000);
        }
        
        // Show auto-dismissing game over message
        function showGameOverMessage(message) {
            const gameOverDiv = document.createElement('div');
            gameOverDiv.className = 'game-over-message';
            gameOverDiv.innerHTML = `<div class="font-kannada">${message}</div>`;
            document.body.appendChild(gameOverDiv);
            
            // Auto-remove after animation
            setTimeout(() => {
                if (gameOverDiv.parentNode) {
                    gameOverDiv.parentNode.removeChild(gameOverDiv);
                }
            }, 5000);
        }

        // Submit guess
        function submitGuess() {
            if (gameStatus !== 'playing') return;
            
            const englishText = englishInput.value.trim();
            if (!englishText) return;
            
            const kannadaText = transliterator.transliterate(englishText);
            const syllables = transliterator.splitIntoSyllables(kannadaText);
            
            console.log('Debug - English:', englishText, 'Kannada:', kannadaText, 'Syllables:', syllables);
            
            // Validate syllable count - count non-empty syllables
            const validSyllables = syllables.filter(s => s && s.trim() !== '');
            if (validSyllables.length < 3 || validSyllables.length > 4) {
                // Show validation message
                const existingValidation = document.querySelector('.validation-display');
                if (existingValidation) existingValidation.remove();
                
                const validationDiv = document.createElement('div');
                validationDiv.className = 'hint-display validation-display';
                validationDiv.innerHTML = `
                    <div><strong>Invalid Word Length</strong></div>
                    <div style="margin-top: 0.5rem;">Word should be 3-4 syllables</div>
                    <div style="margin-top: 0.25rem; font-size: 0.875rem; opacity: 0.8;">Current: ${validSyllables.length} syllables</div>
                    <div style="margin-top: 0.25rem; font-size: 0.75rem; opacity: 0.6;">Syllables: ${validSyllables.join(', ')}</div>
                `;
                
                document.body.appendChild(validationDiv);
                
                setTimeout(() => {
                    if (validationDiv.parentNode) {
                        validationDiv.parentNode.removeChild(validationDiv);
                    }
                }, 4000);
                
                return;
            }
            
            // Analyze guess
            const colors = analyzeGuess(kannadaText, currentWord.word, currentWord.syllables);
            
            // Store guess
            guesses.push({
                syllables: syllables,
                colors: colors
            });
            
            // Check win condition
            if (colors.every(color => color === 'correct')) {
                gameStatus = 'won';
            } else if (guesses.length >= 10) {
                gameStatus = 'lost';
            }
            
            // Clear input
            englishInput.value = '';
            updatePreview();
            updateGrid();
            updateGameStatus();
        }

        function toggleHelp() {
            helpModal.style.display = helpModal.style.display === 'block' ? 'none' : 'block';
        }

        function toggleHistory() {
            const historyModal = document.getElementById('historyModal');
            
            // Populate past 6 days when opening
            if (historyModal.style.display !== 'block') {
                populatePastDays();
            }
            
            historyModal.style.display = historyModal.style.display === 'block' ? 'none' : 'block';
        }

        function populatePastDays() {
            const dateButtons = document.getElementById('dateButtons');
            dateButtons.innerHTML = '';
            
            const today = new Date();
            
            // Create buttons for past 6 days (including today)
            for (let i = 0; i < 6; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                
                const dateStr = date.toLocaleDateString('en-GB', { 
                    day: '2-digit',
                    month: 'short', 
                    year: 'numeric'
                }).replace(/,/g, '');
                
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const isToday = i === 0;
                
                const button = document.createElement('button');
                button.className = 'btn';
                button.style.cssText = `
                    padding: 0.75rem;
                    text-align: left;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    ${isToday ? 'background: hsl(258 70% 45%); border-color: hsl(258 70% 45%);' : ''}
                `;
                
                button.innerHTML = `
                    <span>${dayName}, ${dateStr}</span>
                    <span style="font-size: 0.875rem; opacity: 0.8;">${isToday ? '(Today)' : ''}</span>
                `;
                
                button.addEventListener('click', () => {
                    selectedDate = new Date(date);
                    loadSelectedDate();
                    toggleHistory();
                });
                
                dateButtons.appendChild(button);
            }
        }

        function newGame() {
            // Reset to today's date
            selectedDate = new Date();
            const currentDateDisplay = document.getElementById('currentDateDisplay');
            
            // Show current date by default
            const today = new Date();
            const todayFormatted = today.toLocaleDateString('en-GB', { 
                day: '2-digit',
                month: 'short', 
                year: 'numeric'
            }).replace(/,/g, '');
            currentDateDisplay.textContent = todayFormatted;
            currentDateDisplay.style.display = 'block';
            
            guesses = [];
            gameStatus = 'playing';
            hintsUsed = 0;
            currentWord = getWordOfDay();
            englishInput.value = '';
            updatePreview();
            updateGrid();
            updateGameStatus();
            
            
            // Remove any existing hint or validation displays
            const existingDisplays = document.querySelectorAll('.hint-display, .validation-display');
            existingDisplays.forEach(display => display.remove());
            
            // Reset hint button
            hintBtn.disabled = false;
            hintBtn.style.opacity = '1';
            hintBtn.title = 'Hint (requires at least one correct syllable)';
        }

        function hasCorrectSyllable() {
            // Check if player has at least one Yellow or Green tile
            for (const guess of guesses) {
                for (const color of guess.colors) {
                    if (color === 'correct' || color === 'wrong-syllable') {
                        return true;
                    }
                }
            }
            return false;
        }

        function dismissHint() {
            const existingHint = document.querySelector('.hint-display');
            if (existingHint) {
                existingHint.remove();
            }
        }

        function showHint() {
            if (gameStatus !== 'playing' || hintsUsed >= 1) return;
            
            // Remove any existing hint
            dismissHint();
            
            // Check if player has solved at least one syllable
            if (!hasCorrectSyllable()) {
                // Show message that at least one syllable must be solved
                const hintDiv = document.createElement('div');
                hintDiv.className = 'hint-display';
                hintDiv.innerHTML = `
                    <div><strong>Hint Not Available</strong></div>
                    <div style="margin-top: 0.5rem;">At least one syllable to be solved for Hint</div>
                    <div style="margin-top: 0.25rem; font-size: 0.875rem; opacity: 0.8;">Get a Yellow or Green tile first!</div>
                `;
                
                // Add hint as fixed overlay to prevent layout displacement
                document.body.appendChild(hintDiv);
                
                // Auto-dismiss after 4 seconds
                setTimeout(() => {
                    if (hintDiv.parentNode) {
                        hintDiv.parentNode.removeChild(hintDiv);
                    }
                }, 4000);
                
                return;
            }
            
            hintsUsed++;
            
            // Show the word meaning as hint
            const hintDiv = document.createElement('div');
            hintDiv.className = 'hint-display';
            hintDiv.innerHTML = `
                <div><strong>Hint:</strong></div>
                <div style="margin-top: 0.5rem;">Word meaning: <strong>${currentWord.meaning}</strong></div>
                <div style="margin-top: 0.25rem; font-size: 0.75rem; opacity: 0.7;">Click anywhere or press any key to dismiss</div>
            `;
            
            // Add hint as fixed overlay to prevent layout displacement
            document.body.appendChild(hintDiv);
            
            // Auto-dismiss after 4 seconds
            setTimeout(() => {
                if (hintDiv.parentNode) {
                    hintDiv.parentNode.removeChild(hintDiv);
                }
            }, 4000);
            
            // Update hint button - only one hint available now
            hintBtn.disabled = true;
            hintBtn.style.opacity = '0.5';
            hintBtn.title = 'Hint already used';
        }

        function showEasterEgg() {
            if (guesses.length >= 5 && gameStatus === 'playing') {
                easterEggDiv.querySelector('.font-kannada').textContent = currentWord.syllables[0];
                easterEggDiv.style.display = 'block';
                setTimeout(() => {
                    easterEggDiv.style.display = 'none';
                }, 3000);
            }
        }

        // Event listeners
        // Handle first character auto-capitalization only
        englishInput.addEventListener('input', function(e) {
            const value = e.target.value;
            // Only convert first character to lowercase if it was auto-capitalized
            if (value.length === 1 && value === value.toUpperCase() && value !== value.toLowerCase()) {
                e.target.value = value.toLowerCase();
            }
            updatePreview();
        });
        englishInput.addEventListener('keydown', (e) => {
            // Dismiss any hints on key press
            dismissHint();
            
            if (e.key === 'Enter') {
                e.preventDefault();
                submitGuess();
            }
        });
        submitBtn.addEventListener('click', submitGuess);
        helpBtn.addEventListener('click', toggleHelp);
        historyBtn.addEventListener('click', toggleHistory);
        hintBtn.addEventListener('click', showHint);
        newGameBtn.addEventListener('click', newGame);
        
        // Global click handler to dismiss hints (mobile-friendly)
        document.addEventListener('click', (e) => {
            const hintDisplay = document.querySelector('.hint-display');
            if (hintDisplay && !hintDisplay.contains(e.target) && e.target !== hintBtn) {
                dismissHint();
            }
        });
        
        // Global keydown handler to dismiss hints
        document.addEventListener('keydown', (e) => {
            // Only dismiss if it's not the input field (to avoid interference)
            if (e.target !== englishInput) {
                dismissHint();
            }
        });
        
        // Easter egg functionality
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && !easterEggTimer) {
                easterEggTimer = setTimeout(showEasterEgg, 3000);
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (easterEggTimer && (!e.ctrlKey || !e.shiftKey)) {
                clearTimeout(easterEggTimer);
                easterEggTimer = null;
            }
        });
        
        // Close modal on click outside
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                toggleHelp();
            }
        });
        
        // Close history modal on click outside
        document.getElementById('historyModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('historyModal')) {
                toggleHistory();
            }
        });
        
        // Initialize game
        initializeGrid();
        updatePreview();
        updateGrid();
        updateGameStatus();
        
        // Initialize current word after transliterator is ready
        setTimeout(() => {
            currentWord = getWordOfDay();
            console.log('Today\'s word:', currentWord);
        }, 100);
        
        // Show current date by default
        const currentDateDisplay = document.getElementById('currentDateDisplay');
        const today = new Date();
        const todayFormatted = today.toLocaleDateString('en-GB', { 
            day: '2-digit',
            month: 'short', 
            year: 'numeric'
        }).replace(/,/g, '');
        currentDateDisplay.textContent = todayFormatted;
        currentDateDisplay.style.display = 'block';
        
        function loadSelectedDate() {
            // Update current date display
            const currentDateDisplay = document.getElementById('currentDateDisplay');
            const selectedFormatted = selectedDate.toLocaleDateString('en-GB', { 
                day: '2-digit',
                month: 'short', 
                year: 'numeric'
            }).replace(/,/g, '');
            currentDateDisplay.textContent = selectedFormatted;
            currentDateDisplay.style.display = 'block';
            
            // Reset game for new date
            guesses = [];
            gameStatus = 'playing';
            hintsUsed = 0;
            currentWord = getWordOfDay();
            englishInput.value = '';
            updatePreview();
            updateGrid();
            updateGameStatus();
            
            // Remove any existing displays
            const existingDisplays = document.querySelectorAll('.hint-display, .validation-display');
            existingDisplays.forEach(display => display.remove());
            
            // Reset hint button
            hintBtn.disabled = false;
            hintBtn.style.opacity = '1';
            hintBtn.title = 'Hint (requires at least one correct syllable)';
        }

        // Load selected date functionality
        document.getElementById('loadDateBtn').addEventListener('click', () => {
            const dateInput = document.getElementById('dateSelector');
            if (dateInput.value) {
                selectedDate = new Date(dateInput.value + 'T00:00:00');
                loadSelectedDate();
                
                // Close modal
                document.getElementById('historyModal').style.display = 'none';
            }
        });

        hintBtn.title = 'Hint (requires at least one correct syllable)';
        englishInput.focus();
    
