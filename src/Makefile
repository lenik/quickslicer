SCSS = scss
SCSSFLAGS = --sourcemap=none

all-css: \
    index.css \
    inc/quickslicer.css

%.css: %.scss config.scss inc/
	$(SCSS) $(SCSSFLAGS) $< $@

clean: 
	rm -f \
	    index.css

auto-build:
	onchange \
	    -f . \
	    -f inc \
        make

