# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

puts "Initialize Seed Generation..."
puts "."
puts "."
puts "."
puts "."

puts "Generating Dummy Users..."
u1 = User.create!(username: "Injustice", password: "password")
puts u1

puts "Generating Dummy Game Saves"
g1 = u1.gamesaves.create!(pos_x: 0, pos_y: 0)
puts g1

puts "Generating Dummy Maps"
m1 = Map.create!(pos_x:0, pos_y:0, name: "Middle", description:"Center", north: true, east: true, south: true, west: true)
puts m1
m2 = Map.create!(pos_x:1, pos_y:0, name: "East", description:"Right", north: true, east: false, south: true, west: true)
puts m2
m3 = Map.create!(pos_x:1, pos_y:-1, name: "South East", description:"Bottom Right", north: true, east: false, south: false, west: true)
puts m3
m4 = Map.create!(pos_x:0, pos_y:-1, name: "South", description:"Bottom", north: true, east: true, south: false, west: true)
puts m4
m5 = Map.create!(pos_x:-1, pos_y:-1, name: "South West", description:"Bottom Left", north: true, east: true, south: false, west: false)
puts m5
m6 = Map.create!(pos_x:-1, pos_y:0, name: "West", description:"Left", north: true, east: true, south: true, west: false)
puts m6
m7 = Map.create!(pos_x:-1, pos_y:1, name: "North West", description:"Top Left", north: false, east: true, south: true, west: false)
puts m7
m8 = Map.create!(pos_x:0, pos_y:1, name: "North", description:"Top", north: false, east: true, south: true, west: true)
puts m8
m9 = Map.create!(pos_x:1, pos_y:1, name: "North East", description:"Top Right", north: false, east: false, south: true, west: true)
puts m9

puts "Seeding complete!!"