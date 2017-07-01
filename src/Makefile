SCSS = scss
SCSSFLAGS = -I /usr/share/javascript/zwk

all-css: \
    index.css

%.css: %.scss config.scss /usr/share/javascript/zwk
	$(SCSS) $(SCSSFLAGS) $< $@
	# mvn-copytotarget "$@"

clean: 
	rm -f \
	    index.css

auto-build:
	onchange \
	    -f . \
	    -f /usr/share/javascript/zwk \
        make

symlinks:
	ln -snf \
	    /usr/share/javascript/createjs/ \
	    /usr/share/javascript/jquery/ \
	    /usr/share/javascript/jquery-flot/ \
	    /usr/share/javascript/jquery-ui/ \
	    /usr/share/javascript/zwk/ \
	    /usr/share/javascript/vuejs/ \
	    libjs/
	ln -snf \
	    /usr/share/fonts-font-awesome \
	    libfont/font-awesome

