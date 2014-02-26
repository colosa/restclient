
desc "Use the Closure Compiler to compress restclient.js"

task :required do
    puts "Checking GEMs required..."
    isOk = true
    begin
        require 'rubygems'
    rescue LoadError
        puts "rubygems not found.\nInstall it by running 'yum install rubygems'"
        isOk = false
    end
    begin
        require 'closure-compiler'
    rescue LoadError
        puts "closure-compiler gem not found.\nInstall it by running 'gem install closure-compiler'"
        isOk = false
    end
    if !isOk
        exit
    end
    puts "DONE"
end

task :build do
  version = getVersion
  puts "Build Package version: " + version

  text = File.read('package.json.txt')
  newtext = text.gsub(/RESTCLIENT_VERSION/, version)
  File.open('package.json', 'w') do |file|
    file.write newtext
  end


  source = File.read('restclient.js')
  newsource = source.gsub(/RESTCLIENT_VERSION/, version)
  min = Closure::Compiler.new.compile(newsource)
  File.open('restclient-min.js', 'w') do |file|
    file.write min
  end
end

desc "Build the JSDuck documentation"
task :doc do
    sh "jsduck -o docs/ restclient.js"
end

desc "Default Task - Build Library"
task :default do
  Rake::Task['required'].execute
  Rake::Task['build'].execute
end

def getVersion
    if File.exists? 'VERSION.txt'
        version = File.read 'VERSION.txt'
    else
        File.open('VERSION.txt', 'w') do |file|
            file.write "0.1.6"
        end
    end
    version = File.read 'VERSION.txt'

    return version
    exit
end
