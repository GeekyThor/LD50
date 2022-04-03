export class BombGameContext {
    constructor(bomb, start_time, start_probablility, probability_increment)
    {
        this.bomb = bomb;
        this.start_time = start_time;
        this.start_probablility = start_probablility;
        this.probability_increment = probability_increment;
    }
}


export class BombGenerator {
    constructor(bomb_contexts)
    {
        this.inactive_contexts = bomb_contexts
        this.active_contexts = []
    }

    get_next(current_time)
    {
        // Wake up relevant contexts
        for (const i in this.inactive_contexts)
        {
            if (current_time > this.inactive_contexts[i].start_time)
            {
                this.active_contexts.push(this.inactive_contexts[i]);
                array.splice(i, 1);
            }
        }

        // Calculate the probability for each bomb
        var dist_list = [];
        for (const bomb_context of this.active_contexts)
        {
            dist_list.push(bomb_context.start_probablility + (current_time - bomb_context.start_probablility) * bomb_context.probability_increment)
        }

        // TODO: Somehow select a bomb from the list based on the probability distribution.
    }
}