# BETA 01
# For UNIXes (x86_64/aarch64):		sudo make all install test
# For Windows (x86_64/aarch64):		make microsoft-win64 test-win64

# Uninstall PowerC:					sudo make remove
# Test PowerC:						make test



# VERY UNSTABLE!
# For UNIXes other architectures:  	sudo make vm-experimental-install

CP=cp -Rfv
MKDIR=mkdir -p
RM=rm -Rfv
LINK=ln -s
NPM_INSTALL=npm install --save
PKG=npx pkg
POWERC=/usr/local/bin/powerc
POWERSHARP_BIN=powerc
POWERSHARP=powersharp
DIST_EXE=dist
POWERC_SAMPLE_USR=/usr/local/powersharp-sample
POWERC_SAMPLE=powersharp-sample


all:
	$(NPM_INSTALL)
	$(RM) $(DIST_EXE)
	$(PKG) -t node14 -o $(DIST_EXE)/$(POWERSHARP_BIN) $(POWERSHARP)/$(POWERSHARP_BIN).js

install: remove
	$(CP) $(DIST_EXE)/$(POWERSHARP_BIN) $(POWERC)
	$(CP) $(POWERC_SAMPLE) $(POWERC_SAMPLE_USR)
remove:
	$(RM) $(POWERC)
	$(RM) $(POWERC_SAMPLE_USR)
#$(RM) $(DIST_EXE)
test:
	./$(DIST_EXE)/$(POWERSHARP_BIN)



microsoft-win64:
	$(NPM_INSTALL)
	$(PKG) -t node14 -o $(DIST_EXE)-win64/$(POWERSHARP_BIN) $(POWERSHARP)/$(POWERSHARP_BIN).js

test-win64:
	start $(DIST_EXE)-win64\$(POWERSHARP_BIN)


.PHONY: all install microsoft-win64