# Vampire: The Masquerade V5 Character Creation Rules

This document explains how different aspects of your character affect character creation in VtM V5.

## What Affects Character Creation

### 1. **Clan** ✅ (Already Implemented)
- **Starting Disciplines**: You automatically get **1 dot** in each of your clan's 3 disciplines (free, doesn't count against points)
- **Favored Attributes**: One attribute category (Physical, Social, or Mental) is favored
  - At least **one attribute** in your favored category must be **2 or higher**
  - At least **one skill** in your favored category must be **1 or higher**
- **Clan Bane**: Each clan has a unique weakness
- **Compulsion**: Each clan has a compulsion that affects behavior

### 2. **Predator Type** ⚠️ (Needs Implementation)
**This is a CRITICAL part of character creation that we need to add!**

Each predator type gives **FREE dots** that don't count against your point pools:

- **Free Discipline Dot**: Many predator types give a free dot in a specific discipline
- **Free Skill Dot**: Some give a free dot in a skill
- **Free Background Dot**: Some give free background dots (like Herd or Fame)

**Examples:**
- **Alleycat**: Free dot in Potence or Brawl
- **Bagger**: Free dot in Larceny + Herd background
- **Siren**: Free dot in Presence or Persuasion
- **Sandman**: Free dot in Obfuscate or Stealth
- **Farmer**: Free dot in Animal Ken + Herd background

**Important**: These free dots are in addition to your normal point allocation!

### 3. **Generation** ⚠️ (Partially Implemented)
- **Blood Potency**: Lower generation = higher starting Blood Potency
  - Generation 13-15: Blood Potency 0
  - Generation 10-12: Blood Potency 1
  - Generation 8-9: Blood Potency 2
- **Maximum Attributes/Skills**: Lower generation can have higher maximums
- **Social Standing**: Lower generation often has higher Status

### 4. **Sect** ⚠️ (Needs Implementation)
- **Starting Backgrounds**: Some sects give free background dots
  - **Camarilla**: Often starts with Status 1 (free)
  - **Sabbat**: Different starting resources
  - **Anarch**: May start with different backgrounds
- **Available Predator Types**: Some predator types are more common in certain sects
- **Social Standing**: Affects how you're viewed in Kindred society

### 5. **Age/Years Since Embrace** (Informational)
- Doesn't directly affect point allocation during creation
- Affects roleplay and story context
- Older vampires may have more experience points (post-creation)

## Current Implementation Status

✅ **Fully Implemented:**
- Clan selection and clan disciplines
- Favored attribute requirements
- Point tracking for attributes, skills, merits, flaws

⚠️ **Needs Implementation:**
- **Predator Type bonuses** (free discipline/skill/background dots)
- **Sect bonuses** (free starting backgrounds)
- **Generation effects** (Blood Potency, maximums)

## Next Steps

1. **Add Predator Type System**:
   - Load predator types in character creator
   - Apply free dots when predator type is selected
   - Update points calculator to account for free dots
   - Show predator type bonuses in UI

2. **Add Sect Bonuses**:
   - Apply free backgrounds based on sect
   - Update character creation to reflect sect choices

3. **Add Generation Effects**:
   - Calculate starting Blood Potency from generation
   - Apply maximum attribute/skill limits
   - Show generation effects in character sheet

## Point Allocation Summary

- **Attributes**: 7 points (all start at 1)
- **Skills**: 11 points (all start at 0)
- **Disciplines**: 3 free dots (one in each clan discipline) + 1 free from predator type
- **Merits**: 7 base points + up to 7 from flaws
- **Backgrounds**: Selected but don't cost points (except free ones from predator type/sect)

**Total Free Dots from Predator Type**: 1-3 dots (discipline, skill, or background)

