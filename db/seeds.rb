# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

puts "🌱🌱 Seeding started... 🌱🌱"

puts "🧍‍♂️🧍‍♀️ Creating Users... 🧍‍♂️🧍‍♀️"
u1 = User.create!(username:"Injustice", password:"password")
u2 = User.create!(username:"Tester", password:"password")

puts "💾 Creating Gamesaves... 💾"
g1 = u1.gamesaves.create!()
g2 = u2.gamesaves.create!(x: 0, y: 0)

puts "🗺📍🗺 Generating World... 🗺📍🗺"
m1 = Worldmap.create!(x:0, y:0, name: "Starting Area", description: "You wake up in a small, unfamiliar clearing surrounded by trees. There is a path to the north and another to the south.", north: true, east: false, south: true, west: false)
m2 = Worldmap.create!(x:0, y:1, name: "Intersection", description: "You arrive at an intersection. There are paths leading North, East, South, and West.", north: true, east: true, south: true, west: true)
m3 = Worldmap.create!(x:0, y:2, name: "Top of the World", description: "A dead end. You see what appears to be a sculpture of a sword in a stone.", north: false, east: false, south: true, west: false)
m4 = Worldmap.create!(x:1, y:1, name: "East of the Intersection", description: "You see a chest at the end of the path.", north: false, east: false, south: false, west: true)
m4 = Worldmap.create!(x:-1, y:1, name: "West of the Intersection", description: "What a long walk. The path to the West narrows. A light shines at what appears to be the end.", north: false, east: true, south: false, west: true)
m5 = Worldmap.create!(x:-2, y:1, name: "Large Clearing", description: "The sun intensifies and almost blinds you as you make your way through. You stumble over a root into and catch yourself and you notice you are no longer blinded. You stare in awe as a bird rapidly dives into a clear, blue lake and catches a small fish. There are mountains past the lake and more trees to the North.", north: false, east: true, south: false, west: false)
m6 = Worldmap.create!(x:0, y:-1, name: "South of the Starting Area", description: "You begin a casual stroll to the South. A sense of unease washes over you, like a fish out of water. You don't know when it happened, but the trees around you disappeared. The tension becomes so heavy that you can't even breathe. Paralyzed, you find yourself in a large, empty, white space. Resonating voices scream violently from... wh-- inside your head? \"YOU DO NOT BELONG HERE, MORTAL! TURN BACK, NOW!\"", north: true, east: false, south: false, west: false)
# x:,y:,name:,description:,north:,east:,south:,west:

puts "🌲🌲 Seeding complete! 🌲🌲"