require 'rubygems'
require 'uglifier'

desc "Use the Closure Compiler to compress restclient.js"
task :build do
  source = File.read('restclient.js')
  min = Uglifier.compile(source)
  File.open('restclient-min.js', 'w') do |file|
    file.write min
  end
end

desc "Build the JSDuck documentation"
task :doc do
  sh "jsduck -o docs/ restclient.js"
end