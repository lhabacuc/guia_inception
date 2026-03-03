#include <iostream>
#include <string>
#include <fstream>
#include <cstdlib>
#include <sstream>

class cvar
{
	std::string str;
	bool  error_name;
	public:
		cvar();
		cvar(std::string _str);
		~cvar();
		name &operator=(name);

}

typedef struct s_env {
	sf::cvar name;
	sf::cvar
} t_env;

void	set_env(const std::string &name, const std::string &value)
{
	#ifdef _WIN32
		_putenv_s(name.c_str(), value.c_str());
	#else
		setenv(name.c_str(), value.c_str(), 1);
	#endif
	std::cout << ":: name=" << name << " | value="<< getenv(name.c_str()) << std::endl;
}

void	create_setup_env(void)
{

}

void	 

int	file_env(const std::string filename)
{
	std::fstream	file(filename);
	std::string	line;
	std::string	name;
	std::string	value;

	while (std::getline(file, line))
	{
		std::stringstream pline(line);
		if (line.find('=') == std::string::npos)
			break ;
		std::getline(pline, name, '=');
		std::getline(pline, value);
		set_env(name, value);
	}
	return (0);
}

int main(int ac, char **av)
{
	if (ac != 2)
		return (file_env(std::string(".env")));
	return (file_env(std::string(av[1])));
}
