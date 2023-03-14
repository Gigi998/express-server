const data = {
  people: require("../data/people.json"),
  setPeople: function (data) {
    this.people = data;
  },
};

const getAll = (req, res) => {
  res.json(data.people);
};

const createNewPerson = (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  if (!firstname || !lastname)
    return res
      .status(400)
      .json({ message: "First and last name fields are required" });

  const newPerson = {
    id: data.people.length === (1 || 0) ? 1 : data.people.length + 1,
    firstname: firstname,
    lastname: lastname,
  };
  data.setPeople([...data.people, newPerson]);
  res.status(201).json(data.people);
};

const updatePerson = (req, res) => {
  const person = data.people.find((per) => per.id === parseInt(req.body.id));
  if (!person)
    res.status(400).json({ message: `Employee ID ${req.body.id} not found` });
  if (req.body.firstname) person.firstname = req.body.firstname;
  if (req.body.lastname) person.lastname = req.body.lastname;
  // Array with out item we want to update
  const filteredArray = data.people.filter(
    (item) => item.id !== parseInt(req.body.id)
  );
  // New merged array, but it is not sorted
  const unsortedArray = [...filteredArray, person];
  data.setPeople(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );
  res.json(data.people);
};

const deletePerson = (req, res) => {
  const person = data.people.find((per) => per.id === parseInt(req.body.id));
  if (!person) return res.status(400).json({ message: `Person ID not find` });
  const filteredArray = data.people.filter(
    (per) => per.id !== parseInt(req.body.id)
  );
  data.setPeople([...filteredArray]);
  res.json(data.people);
};

const getSinglePerson = (req, res) => {
  const person = data.people.find((per) => per.id === parseInt(req.params.id));
  if (!person)
    res.status(400).json({ message: `Employee ID ${req.params.id} not found` });
  res.json(person);
};

module.exports = {
  getAll,
  createNewPerson,
  updatePerson,
  deletePerson,
  getSinglePerson,
};
