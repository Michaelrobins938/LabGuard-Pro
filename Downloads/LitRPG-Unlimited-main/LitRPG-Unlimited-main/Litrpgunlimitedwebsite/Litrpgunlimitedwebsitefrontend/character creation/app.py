import pygame
import random

# Initialize Pygame
pygame.init()

# Screen dimensions
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)

# Screen setup
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Kingdom Hearts: Dive to the Heart")

# Clock
clock = pygame.time.Clock()
FPS = 60

# Game states
PERSONALITY_QUIZ = 1
WEAPON_SELECTION = 2
TUTORIAL_BATTLE = 3
FINAL_BATTLE = 4
game_state = PERSONALITY_QUIZ

# Character class
class Character(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((50, 50))
        self.image.fill(GREEN)
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        self.health = 100
        self.attack_power = 10
        self.defense = 5

    def update(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            self.rect.x -= 5
        if keys[pygame.K_RIGHT]:
            self.rect.x += 5
        if keys[pygame.K_UP]:
            self.rect.y -= 5
        if keys[pygame.K_DOWN]:
            self.rect.y += 5

    def attack(self, enemy):
        enemy.health -= self.attack_power

# Enemy class
class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((50, 50))
        self.image.fill(RED)
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        self.health = 50
        self.attack_power = 5

    def update(self):
        if self.rect.x < player.rect.x:
            self.rect.x += 2
        if self.rect.x > player.rect.x:
            self.rect.x -= 2
        if self.rect.y < player.rect.y:
            self.rect.y += 2
        if self.rect.y > player.rect.y:
            self.rect.y -= 2

# Quiz questions and responses
quiz_questions = [
    "What are you afraid of? (1: Getting old, 2: Being different, 3: Being indecisive)",
    "What do you want out of life? (1: To see rare sights, 2: To broaden my horizons, 3: To be strong)",
    "What's most important to you? (1: Being number one, 2: Friendship, 3: My prize possessions)"
]
quiz_index = 0
quiz_responses = []

# Weapon choices
weapons = ["Dream Sword", "Dream Shield", "Dream Rod"]
chosen_weapon = None
discarded_weapon = None

# Sprite groups
all_sprites = pygame.sprite.Group()
enemies = pygame.sprite.Group()

# Create player
player = Character(SCREEN_WIDTH // 2, SCREEN_HEIGHT - 50)
all_sprites.add(player)

# Function to handle quiz
def handle_quiz():
    global quiz_index, game_state
    if quiz_index < len(quiz_questions):
        print(quiz_questions[quiz_index])
        response = input("Choose 1, 2, or 3: ")
        quiz_responses.append(int(response))
        quiz_index += 1
    else:
        # Adjust stats based on responses
        if quiz_responses[0] == 1:
            player.defense += 5
        elif quiz_responses[0] == 2:
            player.attack_power += 5
        if quiz_responses[1] == 1:
            player.health += 20
        if quiz_responses[2] == 2:
            player.health += 10
            player.attack_power += 5
        game_state = WEAPON_SELECTION

# Function to handle weapon selection
def handle_weapon_selection():
    global chosen_weapon, discarded_weapon, game_state
    print("Choose your weapon:")
    for i, weapon in enumerate(weapons):
        print(f"{i+1}: {weapon}")
    choice = int(input("Choose 1, 2, or 3: ")) - 1
    chosen_weapon = weapons[choice]
    print("Discard a weapon:")
    discard_choice = int(input("Choose 1, 2, or 3: ")) - 1
    discarded_weapon = weapons[discard_choice]
    # Adjust stats based on weapon choice
    if chosen_weapon == "Dream Sword":
        player.attack_power += 10
    elif chosen_weapon == "Dream Shield":
        player.defense += 10
    elif chosen_weapon == "Dream Rod":
        player.health += 20
    game_state = TUTORIAL_BATTLE

# Game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    if game_state == PERSONALITY_QUIZ:
        handle_quiz()
    elif game_state == WEAPON_SELECTION:
        handle_weapon_selection()
    elif game_state == TUTORIAL_BATTLE:
        # Create enemies for tutorial battle
        if len(enemies) == 0:
            for _ in range(3):
                enemy = Enemy(random.randint(0, SCREEN_WIDTH), random.randint(0, SCREEN_HEIGHT // 2))
                all_sprites.add(enemy)
                enemies.add(enemy)
        # Update and draw everything
        all_sprites.update()
        screen.fill(WHITE)
        all_sprites.draw(screen)
        pygame.display.flip()
        clock.tick(FPS)
        # Check for collisions and attacks
        for enemy in enemies:
            if pygame.sprite.collide_rect(player, enemy):
                player.health -= enemy.attack_power
                enemy.health -= player.attack_power
            if enemy.health <= 0:
                enemy.kill()
        if player.health <= 0:
            print("Game Over")
            running = False
        if len(enemies) == 0:
            game_state = FINAL_BATTLE
    elif game_state == FINAL_BATTLE:
        # Create boss for final battle
        boss = Enemy(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2)
        boss.health = 200
        boss.attack_power = 20
        all_sprites.add(boss)
        enemies.add(boss)
        # Update and draw everything
        all_sprites.update()
        screen.fill(WHITE)
        all_sprites.draw(screen)
        pygame.display.flip()
        clock.tick(FPS)
        # Check for collisions and attacks
        if pygame.sprite.collide_rect(player, boss):
            player.health -= boss.attack_power
            boss.health -= player.attack_power
        if player.health <= 0:
            print("Game Over")
            running = False
        if boss.health <= 0:
            print("You Win!")
            running = False

pygame.quit()
