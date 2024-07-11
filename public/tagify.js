var input = document.querySelector('input[name=tags]')
var tagify = new Tagify(input, {
  dropdown: {
    enabled: 0
  },
//  whitelist: ["a", "aa", "b", "bb", "ccc"]
})

tagify.on('change', console.log)

//tagify.addTags(["a", "b"])