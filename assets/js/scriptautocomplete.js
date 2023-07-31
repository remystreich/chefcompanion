
const recipes = recipeListAutocomplete.map(data => {
    return { label: data.dataValues.title, value: data.dataValues.title };
  });
  
console.log(recipes);
let input = document.getElementById('searchInput');

autocomplete({
    input: input,
    fetch: function(text, update) {
        text = text.toLowerCase();
        // you can also use AJAX requests instead of preloaded data
        let suggestions = recipes.filter(n => n.label.startsWith(text))
        update(suggestions);
    },
    onSelect: function(item) {
        input.value = item.label;
    }
});

