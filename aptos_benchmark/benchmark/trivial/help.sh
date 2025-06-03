#!/bin/sh


all=$(cat maybe_check_again)


mkdir -p ./to_unsupported
mkdir -p ./to_supported
mkdir -p ./to_aptos


for file in $all; do
	clear
	content=$(zstdcat "$file")
	while true; do	
		echo "$content" | bat
		read -p "Options: (?=show again, y=yes, a=to aptos, u=unsupported, s=supported)" choice
		case "$choice" in
			\?) 
					continue
					;;
		 	y)
					break
					;;
			a)
					mv "$file" ./to_aptos
					break
					;;
			u)
					mv "$file" ./to_unsupported
					break
					;;
		 	s)
				  	mv "$file" ./to_supported
					break
					;;
		esac
	done
done		
