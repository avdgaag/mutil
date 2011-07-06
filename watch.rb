#!/usr/bin/env ruby -w

# Make sure this file is not run on its own, but as
# a watchr script.
if $0 == __FILE__
  abort 'Run this script using the watchr gem.'
end

# Try to set up javascript minification using the uglifier Ruby gem.
begin
  require 'uglifier'

  $minfile = File.expand_path('../mutil.min.js', __FILE__)

  def minify(file)
    File.open($minfile, 'w') do |f|
      f.write Uglifier.compile(File.read(file))
    end
    puts 'Generated minified file at ' + $minfile
  end

rescue LoadError
  warn 'Minification is not available unless you install the uglifier gem.'
end

# Try to set up auto-generated documentation using the Docco Node.js package.
if `which docco`.size > 0
  def document(file)
    `docco #{file}`
    puts 'Generated documentation in ./docs'
  end
else
  warn 'Documentation is not available unless you install the docco package.'
end

# Don't do anything and quit, unless one of our tasks is available.
unless respond_to?(:document) or respond_to?(:minify)
  abort 'Neither docco or uglify are available.'
end

# The actual watchr instructions
watch('src/mutil.js') do |m|
  document(m[0]) if respond_to?(:document)
  minify(m[0])   if respond_to?(:minify)
  puts 'Waiting for changes in ' + m[0] + '...'
end

