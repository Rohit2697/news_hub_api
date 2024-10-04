export const generateRecommendationCategory = (categories: string[]) => {
  const categoryFrequency: { [key: string]: number } = {}
  let mostRepeated = categories[0];
  let mosetUsed = 0

  for (const category of categories) {
    categoryFrequency[category] = (categoryFrequency[category] || 0) + 1
    if (categoryFrequency[category] > mosetUsed) {
      mosetUsed = categoryFrequency[category]
      mostRepeated = category
    }


  }
  return mostRepeated
}

